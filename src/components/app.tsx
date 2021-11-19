import styled from 'styled-components';
import { GlobalStyle } from './global-style';
import { FC } from 'react';
import { Card } from './card';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const Root = styled.div`
  padding: 48px 24px;
  width: 80vw;
  max-width: 900px;
  margin: 0 auto;
`;

interface cellArgs {
  columnIndex: number;
  rowIndex: number;
  style: any;
}

const CONTAINER_SIZE = 150;

export const App: FC = () => {
  return (
    <>
      <GlobalStyle />
      <Root>
        <div style={{ width: "100%", height:"800px" }}>
          <AutoSizer>
            {({ height, width }) => {
              return (
                <Grid
                  columnCount={Math.floor(width/CONTAINER_SIZE)}
                  columnWidth={CONTAINER_SIZE}
                  height={height}
                  rowCount={1000}
                  rowHeight={CONTAINER_SIZE}
                  width={width}
                  style={{ overflowX: "hidden" }}
                >
                  {(args: cellArgs) => {
                    const { columnIndex, rowIndex, style } = args;
                    return (
                      <div style={style}>
                        <Card name="ak:air" />
                      </div>
                    );
                  }}
                </Grid>
              )
            }}
          </AutoSizer>
        </div>
      </Root>
    </>
  );
};
