import React, { FC } from 'react'
import { useStore } from 'reto'
import styled from 'styled-components'
import { SelectionStore } from '../stores/selection.store'

const IconPart = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  & be-icon {
    transform: translateY(0);
    transition: transform ease-out 0.2s;
  }
`


const Container = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  box-shadow: 3px 3px 13px 0px rgb(0 0 0 / 2%);
  background-color: #ffffff;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  user-select: none;
  cursor: pointer;
  box-sizing: border-box;
  border: 3px solid white;
  transition: border-color ease-out 0.3s;

  &::before {
    content: var(--pack);
    transform: scale(0.8);
    font-size: 12px;
    position: absolute;
    left: -9px;
    top: -5px;
    background-color: white;
    padding: 3px 6px;
    border-radius: 8px 0 8px 0;
    color: #fff;
    transition: background-color ease-out 0.3s;
  }

  &::after {
    content: var(--icon);
    position: absolute;
    font-size: 12px;
    word-break: break-word;
    text-align: center;
    color: green;
    vertical-align: middle;
    bottom: 3px;
    opacity: 0;
    transition: all ease-out 0.2s;
  }

  &:hover {
    border-color: green;
    &::before {
      background-color: green;
    }
    &::after {
      transform: translateY(-10px);
      opacity: 1;
    }
    & be-icon {
      transform: translateY(-2px);
    }
  }
`

interface Props {
  name: string
  pack: string
  icon: string
}

const MAX_DISP_LEN = 12;

function displayName(name: string) {
  return name.length > (MAX_DISP_LEN+3) ? name.slice(0, MAX_DISP_LEN) + '...' : name;
}

export const Card: FC<Props> = props => {
  const selectionStore = useStore(SelectionStore)

  const style = {
    '--pack': `"${props.pack}"`,
    '--icon': `"${displayName(props.icon)}"`,
  } as React.CSSProperties

  return (
    <Container
      style={style}
      onClick={() => {
        selectionStore.setViewing(props.name)
      }}
    >
      <IconPart>
        <be-icon
          name={props.name}
          size='24'
          color='currentColor'
          stroke='1.8'
        />
      </IconPart>
    </Container>
  )
}
