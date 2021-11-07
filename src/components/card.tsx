import React, {FC} from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 8px;
  box-shadow: 3px 3px 13px 0px rgb(0 0 0 / 2%);
  background-color: #ffffff;
  position: relative;
`

const IconPart = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const LabelPart = styled.div`
  position: absolute;
  width: 100%;
  font-size: 12px;
  word-break: break-word;
  text-align: center;
  color: green;
  vertical-align: middle;
  bottom: 10px;
  opacity: 1;
  transition: all ease-out 0.2s;
`


interface Props {
  name: string
}

export const Card: FC<Props> = (props) => {
  return (
    <Container>
      <IconPart>
        <be-icon name={props.name} size="32" color="#333" stroke="1.8" />
      </IconPart>
      <LabelPart>
        {props.name}
      </LabelPart>
    </Container>
  )
}
