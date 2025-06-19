import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import CreateTask from "./CreateTask";
import { useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function MyTasks() {
  const [showForm, setShowForm] = useState(false);
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ alignSelf: "center" }}>
        My Tasks
      </Typography>
      <Box>
        <Button
          onClick={() => setShowForm(true)}
          variant="contained"
          sx={{
            backgroundColor: "#1E2939",
            color: "white",
            fontWeight: "bold",
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
      <Box sx={{ overflowY: "auto" }}>
        {showForm && <CreateTask onClose={() => setShowForm(false)} />}
      </Box>
    </Stack>
  );
}
