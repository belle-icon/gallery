import styled from 'styled-components'
import { GlobalStyle } from './global-style'
import { Card } from './card'
import { Tabs } from './tabs'
import { Provider } from 'reto'
import { SelectionStore } from '../stores/selection.store'
import { useAsyncMemo } from 'use-async-memo'
import { ViewingModal } from './viewing-modal'
import { parseIcons } from '../utils/decompress'
import { Dexie } from 'dexie'
import { staged } from 'staged-components'
import { Logo } from './logo'
import { WindowScroller, Grid } from 'react-virtualized'
import 'react-virtualized/styles.css'

const Root = styled.div`
  width: 900px;
  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  padding: 36px 0;
  svg {
    display: inline-block;
  }
`

const TabsContainer = styled.div`
  background-color: rgb(246, 248, 250);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 12px 0;
  margin-bottom: 24px;
`

const IconsContainer = styled.div`
  background-color: inherit;
`

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

    const contentWidth = 900

    return (
      <>
        <GlobalStyle />
        <Provider of={SelectionStore} memo>
          <ViewingModal />
          <WindowScroller>
            {({ height, isScrolling, registerChild, scrollTop }) => {
              const colCount = Math.floor(contentWidth / CONTAINER_SIZE)
              return (
                <Root>
                  <Header>
                    <Logo />
                  </Header>
                  <TabsContainer>
                    <Tabs />
                  </TabsContainer>
                  <IconsContainer ref={registerChild}>
                    <Grid
                      columnCount={colCount}
                      columnWidth={CONTAINER_SIZE}
                      autoHeight={true}
                      autoWidth={true}
                      rowCount={Math.ceil(TOTAL / colCount)}
                      rowHeight={CONTAINER_SIZE}
                      width={contentWidth}
                      height={height}
                      scrollTop={scrollTop}
                      isScrolling={isScrolling}
                      cellRenderer={args => {
                        const { columnIndex, rowIndex, style } = args
                        const index = rowIndex * colCount + columnIndex
                        const iconInfo = info[index]
                        if (!iconInfo) return <></>
                        const pack = sources[iconInfo.pack_index]
                        const icon = iconInfo.icon_name
                        const name = `${pack.abbr}:${icon}`
                        return (
                          <div style={style} key={index}>
                            <Card name={name} pack={pack.name} icon={icon} />
                          </div>
                        )
                      }}
                    />
                  </IconsContainer>
                </Root>
              )
            }}
          </WindowScroller>
        </Provider>
      </>
    )
  }
})
