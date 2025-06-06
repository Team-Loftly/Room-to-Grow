import { Box, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import ItemTile from "./ItemTile";

export default function ItemGrid() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("initial");

  useEffect(() => {
    if (state === "initial") {
      setState("loading");
      setItems(Array.from(Array(9)));
    }

    setState("loaded");
  }, []);

  return (
    <Box
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
      <Grid
        container
        spacing={{ xs: 1, md: 1 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {items.map((_, index) => (
          <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
            <ItemTile id={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
