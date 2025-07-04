import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TaskCardList from "./TaskCardList";
import TasksLeftPageToolBar from "./TasksLeftPageToolbar";

export default function MyTasks() {
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{
        width: "90%",
        height: "90%",
        boxSizing: "border-box",
        display: "flex",
        marginTop: 4,
        p: 2,
        borderRadius: 3,
        bgcolor: "transparent",
      }}
    >
      <TasksLeftPageToolBar />
      <Box sx={{ overflowY: "auto" }}>
        <TaskCardList />
      </Box>
    </Stack>
  );
}
