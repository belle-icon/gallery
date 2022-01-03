import React, { FC, useState } from 'react'
import styled from 'styled-components'

const categories = ['Web', 'Arrows', 'Text', 'Socail']

const Container = styled.div`
  display: flex;
`

const Item = styled.div<{
  active: boolean
}>`
  flex: none;
  margin-right: 40px;
  font-size: 20px;
  line-height: 1.6;
  color: ${props => (props.active ? '#4E5969' : '#B0B0B0')};
  font-weight: 500;
  cursor: pointer;
`

interface Props {}

export const Tabs: FC<Props> = props => {
  const [selected, setSelected] = useState('')
  return (
    <Container>
      <Item
        active={selected === ''}
        onClick={() => {
          setSelected('')
        }}
      >
        All
      </Item>
      {categories.map(category => (
        <Item
          key={category}
          active={selected === category}
          onClick={() => {
            setSelected(category)
          }}
        >
          {category}
        </Item>
      ))}
    </Container>
  )
}
