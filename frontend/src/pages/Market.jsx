import { Stack, Divider } from "@mui/material";
import ItemDisplay from "../components/market/ItemDisplay";
import ItemGrid from "../components/market/ItemGrid";

function Market() {
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
      <ItemGrid />
    </Stack>
  );
}

export default Market;
