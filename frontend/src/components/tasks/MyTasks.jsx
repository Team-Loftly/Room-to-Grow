import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/icons-material/Button";
import CreateTask from "./CreateTask";
import Stack from "@mui/material/Stack";
import TaskCardList from "./TaskCardList";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function MyTasks() {
  const tasks = useSelector((state) => state.tasks.taskList);
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
      {!showForm && (
        <Typography variant="h6" sx={{ alignSelf: "center" }}>
          My Tasks
        </Typography>
      )}
      {showForm && (
        <Typography variant="h6" sx={{ alignSelf: "center" }}>
          Create a Task
        </Typography>
      )}
      {!showForm && (
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
      )}
      <Box sx={{ overflowY: "auto" }}>
        {showForm && <CreateTask onClose={() => setShowForm(false)} />}
      </Box>
      {!showForm && (
        <Box sx={{ overflowY: "auto" }}>
          <TaskCardList tasks={tasks} />
        </Box>
      )}
    </Stack>
  );
}
