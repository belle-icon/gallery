import styled from 'styled-components';
import {GlobalStyle} from './global-style'
import { FC } from 'react';
import { Card } from './card';

const Root = styled.div`
  padding: 48px 24px;
  width: 80vw;
  max-width: 900px;
  margin: 0 auto;
`

export const App: FC = () => {
  return (
    <>
    <GlobalStyle/>
    <Root>
      <Card name='ak:air'/>
    </Root>
    </>
  );
}
