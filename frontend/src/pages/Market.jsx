import { Stack, Divider } from "@mui/material";
import ItemDisplay from "../components/market/ItemDisplay";
import ItemGrid from "../components/market/ItemGrid";
import { useSelector } from "react-redux";
import { selectMarketItems } from "../features/marketSlice";
function Market() {
  const items = useSelector(selectMarketItems);
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
      <ItemGrid items={items} title="Marketplace"/>
    </Stack>
  );
}

export default Market;
