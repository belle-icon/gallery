import { FC } from 'react'
import styled from 'styled-components'
import { Flex, Link, Button, Box } from '@chakra-ui/react'
import { Logo } from './logo'

const Container = styled.div`
  text-align: center;
  padding: 36px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
`

const Features = styled.ul`
  list-style-type: none;
  max-width: 900px;

  li {
    font-size: 12px;
    display: inline-block;

    + li {
      margin-left: 14px;
    }
  }

  be-icon {
    display: inline-block;
    transform: translateY(2px);
    margin-right: 4px;
    color: green;

    .svg {
      width: 14px !important;
      height: 14px !important;
    }
  }
`

export const Intro: FC = () => {
  return (
    <Container>
      <Box my='6'>
        <Logo />
      </Box>
      <h1
        style={{
          fontSize: 50,
          fontWeight: 700,
          maxWidth: 500,
          lineHeight: 1.3,
        }}
      >
        Icon Library for HUMANS
      </h1>
      <p style={{ maxWidth: 700 }}>
        Ease the pain of designers and developers when it comes to the icons in
        your frontend project. And Belle Icons will be open source forever. Yes,
        forever.
      </p>
      <Flex>
        <Button
          variant='outline'
          color='#008000'
          size='lg'
          mr='10'
          fontSize={14}
        >
          Github
        </Button>
        <Button
          variant='solid'
          size='lg'
          fontSize={14}
          backgroundColor='#008000'
          color='white'
        >
          <Link href='#search'>Get Started</Link>
        </Button>
      </Flex>

      <Features>
        <li>
          <be-icon name='ak:check' size='16'></be-icon>30000 SVG Icons
        </li>
        <li>
          <be-icon name='ak:check'></be-icon>0 non-free icons
        </li>
        <li>
          <be-icon name='ak:check'></be-icon>Vue, React, Vanilla JS...
        </li>
        <li>
          <be-icon name='ak:check'></be-icon>SVG, Figma, Framer...
        </li>
        <li>
          <be-icon name='ak:check'></be-icon>MIT license
        </li>
      </Features>
    </Container>
  )
}
