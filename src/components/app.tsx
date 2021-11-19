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
                  columnCount={Math.floor(width/180)}
                  columnWidth={180}
                  height={height}
                  rowCount={1000}
                  rowHeight={180}
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
