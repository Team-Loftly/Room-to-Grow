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
      divider={
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: "black", borderWidth: "1px" }}
        />
      }
      sx={{
        height: "100%",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ItemDisplay />
      <ItemGrid items={items} title="Marketplace" />
    </Stack>
  );
}

export default Market;
