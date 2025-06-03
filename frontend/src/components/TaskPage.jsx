import NavBar from "./NavBar";
import { Box, Container } from "@mui/material";
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import BookPage from "./tasks/BookPage";
import AddTaskButton from "./tasks/AddTaskButton";


export default function TaskPage() {
  return (
        <Box className="Task">
          <NavBar />
          <Container sx={{ m: 4 }}>
            <Stack direction="row" spacing={2} >
            <BookPage>
              <Stack direction="column" spacing={2} sx={{ width:"100%", height:"100%", display: "flex" }}>
                <Typography variant="h4">My Tasks</Typography>
                <AddTaskButton />
              </Stack>
            </BookPage>
            <BookPage>
              <Typography variant="h4">My Metrics</Typography>
            </BookPage>
            </Stack>
          </Container>
        </Box>
      );
}