import { useEffect } from "react";
import { Stack, Divider, Typography } from "@mui/material";
import ItemDisplay from "../components/market/ItemDisplay";
import ItemGrid from "../components/market/ItemGrid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDecorations,
  selectMarketItems,
  selectMarketStatus,
  selectMarketError,
} from "../features/marketSlice";

function Market() {
  const dispatch = useDispatch();
  const items = useSelector(selectMarketItems);
  const status = useSelector(selectMarketStatus);
  const error = useSelector(selectMarketError);

  // fetch items on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDecorations());
    }
  }, [dispatch, status]);

  // handle loading and error
  if (status === "loading") {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Typography>Loading</Typography>
      </Stack>
    );
  }

  if (status === "failed") {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Typography color="error">Error: {error}</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        height: "90vh",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
      }}
    >
      <ItemDisplay
        sx={{
          flexGrow: 2,
          width: "30%", // Use direct percentage, Stack will manage spacing around it
          // You might need min/max width if this ItemDisplay has content that
          // makes it too small/large on extreme zooms or screen sizes.
          // minWidth: '200px',
          // maxWidth: '400px',
        }}
      />
      <Divider
        orientation="vertical"
        sx={{
          borderColor: "white",
          borderWidth: "1px",
          height: "90%",
          flexShrink: 0,
        }}
      />
      <ItemGrid
        items={items}
        title="Marketplace"
        sx={{ flexGrow: 4, width: "40%" }}
      />
    </Stack>
  );
}

export default Market;
