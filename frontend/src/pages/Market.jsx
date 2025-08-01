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
import BackButton from "../components/BackButton.jsx";

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
      spacing={4}
      sx={{
        height: "90vh",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
        p: 7,
        position: "relative",
      }}
    >
      <BackButton />
      <ItemDisplay
        sx={{
          flexGrow: 2,
          width: "30%",
          mr: 5,
        }}
      />
      <Divider
        orientation="vertical"
        sx={{
          borderColor: "white",
          borderWidth: "3px",
          height: "100%",
        }}
      />
      <ItemGrid items={items} title="Marketplace" />
    </Stack>
  );
}

export default Market;
