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
        height: "95%",
        width: "60%",
        display: "flex",
        bgcolor: "grey.200",
        m: 3,
        px: 5,
        py: 2,
        overflowY: "auto",
        borderRadius: 4,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{ width: "100%" }}
      >
        {title}
      </Typography>
      <Grid
        container
        spacing={{ xs: 1, md: 1 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {items.map((item, index) => (
          <Grid key={index} item xs={2} sm={4} md={4}>
            {isEditable ? (
              <ItemTile
                item={item.decorId || item}
                selected={selectedId === index}
                onSelect={() => handleToggle(index, item)}
              />
            ) : (
              <ItemTile
                item={item.decorId || item}
                selected={selectedId === index}
                onSelect={() => handleSelect(index, item)}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
