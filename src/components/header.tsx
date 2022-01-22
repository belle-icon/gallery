import { FC } from 'react'
import styled from 'styled-components'
import { Flex, Link, Text, Box } from '@chakra-ui/react'

const NavBar = styled.div`
  border-bottom: 1px solid #eee;
`

export const Header: FC = () => {
  return (
    <NavBar>
      <Flex
        justify='center'
        px='6'
        py='5'
        style={{ fontSize: '12px', fontWeight: '600' }}
      >
        <Box px='5'>
          <Link href='#'>Git Documentation</Link>
        </Box>
        <Box px='5'>
          <Link href='#'>Support the Project</Link>
        </Box>
        <Box px='5'>
          <Link href='#'>Request New Icon Pack</Link>
        </Box>
        <Box px='5'>
          <be-icon
            name='ak:twitter-fill'
            color='green'
            size='18'
            style={{ display: 'inline-block', marginRight: '12px' }}
          />
          <be-icon
            name='ak:facebook-fill'
            color='green'
            size='16'
            style={{ display: 'inline-block', transform: 'translateY(-1px)' }}
          />
        </Box>
        <Box px='5'>
          <Text style={{ userSelect: 'none' }}>
            Design and built with{' '}
            <be-icon
              name='zo:heart'
              size='12'
              style={{ display: 'inline-block', height: '11px', fill: 'green' }}
            />{' '}
            by the Belle Icon Team
          </Text>
        </Box>
      </Flex>
    </NavBar>
  )
}
