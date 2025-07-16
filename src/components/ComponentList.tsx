/**
 * This component renders a list of components as chips in a virtualized list.
 * The virtualization improves performance by only rendering the visible chips in the viewport.
 *
 * Limiitations:
 * - It assumes a fixed number of chips per row (CHIPS_PER_ROW). This means their may be rows with empty space.
 * - It does not handle dynamic resizing of the window. This could be improved by adding a resize observer that recalculates the rows when the window size changes.
 *
 * Possible Improvement:
 * - We could estimate the width of each chip and calculate how many chips fit in a row based on the current width of the window.
 * - We can use a resize observer to dynamically adjust the number of chips per row based on the available space.
 *
 */
import { useMemo } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { AutoSizer, List, CellMeasurer, CellMeasurerCache, ListRowProps } from "react-virtualized";
import { ComponentType } from "../types";

type Props = { components: ComponentType[] };

/**
 * Rough appoximation for how many chips fit per row
 * This helps to determine how many rows we need to render
 */
const CHIPS_PER_ROW = 7;

export default function ComponentList({ components }: Props) {
  const onChipClick = (name: string) => alert(`You clicked ${name}`);

  // Breaks up all our chips into rows. Assumes CHIPS_PER_ROW chips per row
  const rows = useMemo(() => {
    const tmp: ComponentType[][] = [];
    for (let i = 0; i < components.length; i += CHIPS_PER_ROW) {
      tmp.push(components.slice(i, i + CHIPS_PER_ROW));
    }
    return tmp;
  }, [components]);

  /**
   * Keeps track of the height of each row after we have added all the chips and
   * it has wrapped as neeeded.
   * This is necessary for react-virtualized to render correctly
   * We use CellMeasurer to dynamically measure the height of each row
   * based on the content inside it
   */
  const cache = useMemo(() => {
    return new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 48, // Chip height + margin guess
    });
  }, []);

  /**
   * Takes our rows of batched components, creates chips for each component and renders them in a virtualized list.
   */
  const rowRenderer = ({ index, key, parent, style }: ListRowProps) => (
    <CellMeasurer cache={cache} columnIndex={0} parent={parent} rowIndex={index} key={key}>
      {({ registerChild }) => (
        <Box
          ref={registerChild}
          style={style}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            py: 0.5,
          }}
        >
          {rows[index].map((item) => (
            <Chip
              key={item.Name}
              label={item.Name}
              onClick={() => onChipClick(item.Name)}
              sx={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                  cursor: "pointer",
                },
              }}
            />
          ))}
        </Box>
      )}
    </CellMeasurer>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, flexShrink: 0 }}>
        Components
      </Typography>

      {/* Virtualized list to render rows of chips */}
      <Box sx={{ flex: 1 }}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={rows.length}
              rowHeight={cache.rowHeight}
              rowRenderer={rowRenderer}
              overscanRowCount={5}
              style={{ outline: "none" }}
            />
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
}
