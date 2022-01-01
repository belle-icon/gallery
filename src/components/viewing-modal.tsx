import { useClickAway } from 'ahooks'
import { useRef } from 'react'
import { useStore } from 'reto'
import { staged } from 'staged-components'
import styled from 'styled-components'
import { SelectionStore } from '../stores/selection.store'

const Container = styled.div`
  position: fixed;
  z-index: 999;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: auto;
  background: #ffffff;
  border: solid 4px #4e5969;
  border-radius: 40px;
  padding: 40px;
  text-align: center;
`

const Label = styled.div`
  font-size: 14px;
`

const IconPart = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`

interface Props {}

export const ViewingModal = staged<Props>(props => {
  const selectionStore = useStore(SelectionStore)
  const { viewing } = selectionStore
  if (!viewing) return null
  return () => {
    const containerRef = useRef<HTMLDivElement>(null)
    useClickAway(() => {
      selectionStore.setViewing(null)
    }, containerRef)
    return (
      <Container ref={containerRef}>
        <IconPart>
          <be-icon name={viewing} size='40' color='currentColor' stroke='1.8' />
        </IconPart>
        <Label>{viewing}</Label>
      </Container>
    )
  }
})
