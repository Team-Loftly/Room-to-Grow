import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Typography } from "@mui/material";

export default function AddTaskButton() {
  return (
    <Box>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#000000",
          width: "100%",
          height: 20,
          borderRadius: 3,
          p: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography>Add Task</Typography>
        <AddIcon />
      </Button>
    </Box>
  );
}
