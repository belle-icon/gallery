import styled from 'styled-components'
import { GlobalStyle } from './global-style'
import { FC } from 'react'
import { Card } from './card'
import { FixedSizeGrid as Grid } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Tabs } from './tabs'
import { Provider } from 'reto'
import { SelectionStore } from '../stores/selection.store'
import { useAsyncMemo } from 'use-async-memo'
import { ViewingModal } from './viewing-modal'

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

// FIXME: initial page loading is extremely slow (batch load script?)
// FIXME: card::before positinging
// FIXME: configurable url in line 64 and 66

export const App: FC = () => {
  const meta = useAsyncMemo(
    () =>
      Promise.all([
        fetch(
          'https://unpkg.com/@belle-icon/icons@0.2.1/meta/sources.json'
        ).then(data => data.json()),
        fetch('https://unpkg.com/@belle-icon/icons@0.2.1/meta/info.tsv')
          .then(data => data.text())
          .then(data => parseTsv(data)),
      ]),
    []
  )

  if (!meta)
    return (<></>)
  const sources = meta[0] as ISource[];
  const info = meta[1] as unknown as IIconInfo[];

  const CONTAINER_SIZE = 150;
  const TOTAL = info.length;

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
                const colCount = Math.floor(width / CONTAINER_SIZE);
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
                      const pack = sources[iconInfo.pack_index]
                      const icon = iconInfo.icon_name;
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
