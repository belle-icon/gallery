import styled from 'styled-components'
import { GlobalStyle } from './global-style'
import { Card } from './card'
import { FixedSizeGrid as Grid } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Tabs } from './tabs'
import { Provider } from 'reto'
import { SelectionStore } from '../stores/selection.store'
import { useAsyncMemo } from 'use-async-memo'
import { ViewingModal } from './viewing-modal'
import { parseIcons } from '../utils/decompress'
import { Dexie } from 'dexie'
import { staged } from 'staged-components'

const Root = styled.div`
  padding: 48px 24px;
  width: 80vw;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'PingFang SC';
`

interface cellArgs {
  columnIndex: number
  rowIndex: number
  style: any
}

function parseTsv(str: string, header: boolean = true) {
  const lines = str.trim().split('\n')
  const data = lines.slice(+header).map(line =>
    line
      .trim()
      .split('\t')
      .map(cell => (isNaN(+cell) ? cell : +cell))
  )
  if (header) {
    const headers = lines[0].trim().split('\t')
    return data.map(row =>
      Object.fromEntries(headers.map((_, i) => [headers[i], row[i]]))
    )
  } else return data
}

interface ISource {
  name: string
  abbr: string
  index: string
}

interface IIconInfo {
  icon_name: string
  pack_index: number
}

// FIXME: configurable url in line 64 and 66

var db = new Dexie('BelleDB')
db.version(1).stores({
  resources: 'name,content',
  meta: 'version',
})

export const App = staged(() => {
  const packageJson = useAsyncMemo(
    () =>
      fetch('https://unpkg.com/@belle-icon/icons/package.json').then(data =>
        data.json()
      ),
    []
  )
  if (!packageJson) return null
  return () => {
    const { version } = packageJson
    const urlPrefix = `https://unpkg.com/@belle-icon/icons@${version}`
    // TODO: cache responses of sources and info
    const sources = useAsyncMemo<ISource[]>(
      () => fetch(`${urlPrefix}/meta/sources.json`).then(data => data.json()),
      [urlPrefix]
    )
    const info = useAsyncMemo<IIconInfo[]>(async () => {
      const data = await fetch(`${urlPrefix}/meta/info.tsv`)
      const text = await data.text()
      return parseTsv(text) as any as IIconInfo[]
    }, [urlPrefix])
    const iconLoaded = useAsyncMemo(async () => {
      // TODO: cache responses by version
      // if (version === db.table("meta").version) return true
      await fetch(`${urlPrefix}/svg.svg.gz`)
        .then(parseIcons)
        .then(async icons => {
          try {
            await db.table('resources').clear()
            await db
              .table('resources')
              .add({ name: 'icons', content: JSON.stringify(icons) })
          } catch (e) {
            alert(`Error: ${e}`)
          }
        })
      return true
    }, [urlPrefix])
    if (!(sources && info && iconLoaded)) return null
    const CONTAINER_SIZE = 150
    const TOTAL = info.length

    return (
      <>
        <GlobalStyle />
        <Provider of={SelectionStore} memo>
          <Root>
            <ViewingModal />
            <Tabs />
            <div style={{ width: '100%', height: '800px' }}>
              <AutoSizer>
                {({ height, width }) => {
                  const colCount = Math.floor(width / CONTAINER_SIZE)
                  return (
                    <Grid
                      columnCount={colCount}
                      columnWidth={CONTAINER_SIZE}
                      height={height}
                      rowCount={Math.ceil(TOTAL / colCount)}
                      rowHeight={CONTAINER_SIZE}
                      width={width}
                      style={{ overflowX: 'hidden' }}
                    >
                      {(args: cellArgs) => {
                        const { columnIndex, rowIndex, style } = args
                        const index = rowIndex * colCount + columnIndex
                        const iconInfo = info[index]
                        if (!iconInfo) return <></>
                        const pack = sources[iconInfo.pack_index]
                        const icon = iconInfo.icon_name
                        const name = `${pack.abbr}:${icon}`
                        return (
                          <div style={style}>
                            <Card name={name} pack={pack.name} icon={icon} />
                          </div>
                        )
                      }}
                    </Grid>
                  )
                }}
              </AutoSizer>
            </div>
          </Root>
        </Provider>
      </>
    )
  }
})
