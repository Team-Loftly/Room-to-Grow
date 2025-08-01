import { Box, Stack, Typography } from "@mui/material";
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
import Controls from "../components/edit/Controls.jsx";
import BackButton from "../components/BackButton.jsx";

function EditRoom() {
  const dispatch = useDispatch();
  const decorations = useSelector(selectInventoryItems);
  const status = useSelector(selectInventoryStatus);
  const error = useSelector(selectInventoryError);

  // fetch items on mount
  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

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
    <Box // Parent Box
      sx={{
        boxSizing: "border-box",
        height: "90vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <BackButton
        sx={{
          top: "0%",
        }}
      />
      <Box // Controls
        sx={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
        }}
      >
        <Controls />
      </Box>
      <Box // Room
        sx={{
          position: "absolute",
          top: 0,
          left: "-30%",
          width: "130%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <Room isEditable={true} />
      </Box>
      <Box // Inventory
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "40%",
          height: "90%",
          zIndex: 1,
          padding: 0,
          m: 4,
        }}
      >
        <ItemGrid items={decorations} title="Inventory" isEditable={true} />
      </Box>
    </Box>
  );
}

export default EditRoom;
