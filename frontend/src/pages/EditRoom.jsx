import { Stack, Divider, Typography } from "@mui/material";
import ItemGrid from "../components/market/ItemGrid";
import { useSelector, useDispatch } from "react-redux";
import {
  selectInventoryItems,
  selectInventoryError,
  selectInventoryStatus,
} from "../features/inventorySlice";
import { fetchInventory } from "../features/inventorySlice";
import { useEffect } from "react";
import Room from "../components/Room.jsx";

function EditRoom() {
  const dispatch = useDispatch();
  const decorations = useSelector(selectInventoryItems);
  const status = useSelector(selectInventoryStatus);
  const error = useSelector(selectInventoryError);

  // fetch items on mount
  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

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
      <Room isEditable={true} />
      <ItemGrid items={decorations} title="Inventory" isEditable={true} />
    </Stack>
  );
}

export default EditRoom;
