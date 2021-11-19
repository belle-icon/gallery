import React, {FC} from 'react'
import styled from 'styled-components'

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
    font-size: 12px;
    position: absolute;
    left: -3px;
    top: -3px;
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
    bottom: 10px;
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
      transform: translateY(-6px);
    }
  }
`

const IconPart = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  & be-icon {
    transition: transform ease-out 0.2s;
  }
`

interface Props {
  name: string
}

export const Card: FC<Props> = (props) => {
  const style = { "--pack": "\"akar-icons\"", "--icon": "\"air\"" } as React.CSSProperties;
  return (
    <Container style={style}>
      <IconPart>
        <be-icon name={props.name} size="24" color="#333" stroke="1.8" />
      </IconPart>
    </Container>
  )
}
