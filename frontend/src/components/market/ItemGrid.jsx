import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import ItemTile from "./ItemTile";
import { setSelectedItem } from "../../features/marketSlice";
import { toggleDecorationPlacement } from "../../features/roomSlice";
import { useDispatch } from "react-redux";

export default function ItemGrid({ items, title, isEditable = false }) {
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();

  const handleSelect = (index, item) => {
    setSelectedId(index);
    dispatch(setSelectedItem(item));
  };
  const handleToggle = (index, item) => {
    dispatch(toggleDecorationPlacement(index));
  };

  return (
    <Box
      flexDirection="column"
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        // bgcolor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 4,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ width: "100%", color: "white" }}
      >
        {title}
      </Typography>

      <Grid
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ justifyContent: "center", overflowY: "auto" }}
      >
        {items.map((item, index) => (
          <Grid key={index} item xs={2} sm={4} md={4}>
            {isEditable ? (
              <ItemTile
                item={item.decorId || item}
                selected={selectedId === index}
                onSelect={() => handleToggle(index, item)}
                isMarketplace={false}
              />
            ) : (
              <ItemTile
                item={item.decorId || item}
                selected={selectedId === index}
                onSelect={() => handleSelect(index, item)}
                isMarketplace={true}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
