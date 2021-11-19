import React, {FC} from 'react'
import styled from 'styled-components'

const IconPart = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  transform: translateY(0);
  transition: all ease-out 0.2s;
`

const LabelPart = styled.div`
  position: absolute;
  width: 100%;
  font-size: 12px;
  word-break: break-word;
  text-align: center;
  color: #4E5969;
  vertical-align: middle;
  bottom: 10px;
  opacity: 0;
  transition: all ease-out 0.2s;
  transform: translateY(0px);
`

const Container = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 30px;
  border: solid 4px #4E5969;
  box-shadow: 3px 3px 13px 0px rgb(0 0 0 / 2%);
  background-color: #ffffff;
  position: relative;
  box-sizing: border-box;
  &:hover {
    ${IconPart} {
      transform: translateY(-12px);
    }
    ${LabelPart} {
      opacity: 1;
      transform: translateY(-12px);
    }
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
        <be-icon name={props.name} size="40" color="currentColor" stroke="1.8" />
      </IconPart>
    </Container>
  )
}
