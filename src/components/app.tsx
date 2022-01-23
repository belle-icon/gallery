import styled from 'styled-components'
import { GlobalStyle } from './global-style'
import { Card } from './card'
import { Intro } from './intro'
import { Header } from './header'
import { Provider, useStore } from 'reto'
import { SelectionStore } from '../stores/selection.store'
import { useAsyncMemo } from 'use-async-memo'
import { ViewingModal } from './viewing-modal'
import { parseIcons } from '../utils/decompress'
import { Dexie } from 'dexie'
import { staged } from 'staged-components'
import { WindowScroller, Grid } from 'react-virtualized'
import 'react-virtualized/styles.css'
import { Input, InputGroup, InputLeftElement, Box } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { GlobalIconConfigStore } from '../stores/global-icon-config.store'
import { useMemo, useState } from 'react'
import FuzzySet from 'fuzzyset'
import { useDebounce } from 'ahooks'

const Root = styled.div`
  width: 100%;
  height: 100%;
`

const Main = styled.div`
  width: 900px;
  margin: 0 auto;
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
    const globalIconConfigStore = useStore(GlobalIconConfigStore)

    const { version } = packageJson
    const urlPrefix = `https://unpkg.com/@belle-icon/icons@${version}`
    // TODO: cache responses of sources and info
    const sources = useAsyncMemo<ISource[]>(
      () => fetch(`${urlPrefix}/meta/sources.json`).then(data => data.json()),
      [urlPrefix]
    )
    const iconInfoList = useAsyncMemo<IIconInfo[]>(async () => {
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
    if (!(sources && iconInfoList && iconLoaded)) return null

    return () => {
      const fuzzySet = useMemo(
        () => FuzzySet(iconInfoList.map(iconInfo => iconInfo.icon_name)),
        [iconInfoList]
      )

      const [searchValue, setSearchValue] = useState('')
      const searchValueDebounced = useDebounce(searchValue, {
        wait: 500,
        trailing: true,
        leading: false,
      })

      const filteredList = useMemo(() => {
        if (!searchValueDebounced) return iconInfoList
        console.log(fuzzySet.get(searchValueDebounced))
        const similarMap = new Map<string, number>()
        fuzzySet.get(searchValueDebounced)?.forEach(item => {
          similarMap.set(item[1], item[0])
        })
        const result: { iconInfo: IIconInfo; score: number }[] = []
        iconInfoList.forEach(iconInfo => {
          const score = similarMap.get(iconInfo.icon_name)
          if (!score) return
          result.push({
            iconInfo,
            score,
          })
        })
        return result
          .sort((a, b) => b.score - a.score)
          .map(item => item.iconInfo)
      }, [fuzzySet, searchValueDebounced])

      const CONTAINER_SIZE = 150
      const TOTAL = filteredList.length

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
                    <Header></Header>
                    <Main>
                      <Intro></Intro>
                      <Box pr='32px' py='16' w='100%' id='search'>
                        <InputGroup
                          size='lg'
                          backgroundColor='#fff'
                          borderRadius={8}
                          boxShadow='3px 3px 13px 0px rgb(0 0 0 / 2%)'
                          padding='3px 12px'
                        >
                          <InputLeftElement
                            pointerEvents='none'
                            children={<SearchIcon color='gray.300' />}
                            left='unset'
                            top='unset'
                          />
                          <Input
                            placeholder='Search 62345 Icons'
                            border='none'
                            boxShadow='none !important'
                            fontSize={14}
                            color='green'
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                          />
                        </InputGroup>
                      </Box>
                      {/* <TabsContainer>
                    <Tabs />
                  </TabsContainer> */}
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
                            const iconInfo = filteredList[index]
                            if (!iconInfo) return <></>
                            const pack = sources[iconInfo.pack_index]
                            const icon = iconInfo.icon_name
                            const name = `${pack.abbr}:${icon}`
                            return (
                              <div style={style} key={index}>
                                <Card
                                  name={name}
                                  pack={pack.name}
                                  icon={icon}
                                />
                              </div>
                            )
                          }}
                        />
                      </IconsContainer>
                    </Main>
                  </Root>
                )
              }}
            </WindowScroller>
          </Provider>
        </>
      )
    }
  }
})
