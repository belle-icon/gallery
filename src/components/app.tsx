import styled from 'styled-components';
import {GlobalStyle} from './global-style'
import { FC } from 'react';

const Root = styled.div`
  padding: 12px;
`

export const App: FC = () => {
  return (
    <>
    <GlobalStyle/>
    <Root>
      <be-icon name='ak:image' size="64" color="#333" stroke="1.8" />
    </Root>
    </>
  );
}
