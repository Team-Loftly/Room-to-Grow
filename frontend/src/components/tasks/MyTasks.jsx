import { Box, Container } from "@mui/material";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import AddTaskButton from "./AddTaskButton";
import BookPage from "./BookPage";
import NewTask from "./NewTask";

export default function MyTasks() {
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ width: "100%", boxSizing: "border-box", display: "flex" }}
    >
      <Typography variant="h6">My Tasks</Typography>
      <AddTaskButton />
      <Box
        sx={{
          overflowY: "auto",
        }}
      >
        <NewTask />
      </Box>
    </Stack>
  );
}
