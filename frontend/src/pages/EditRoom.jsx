import { Stack, Divider } from "@mui/material";
import ItemGrid from "../components/market/ItemGrid";
import { useSelector } from "react-redux";
import { selectInventoryItems } from "../features/inventorySlice";
function EditRoom() {
  const items = useSelector(selectInventoryItems);
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
      <h2>Three Js render should go here...</h2>
      <ItemGrid items={items} title="Inventory" />
    </Stack>
  );
}

export default EditRoom;
