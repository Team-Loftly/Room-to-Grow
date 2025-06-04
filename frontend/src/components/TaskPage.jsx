import NavBar from "./NavBar";
import { Box, Container } from "@mui/material";
import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import BookPage from "./tasks/BookPage";
import AddTaskButton from "./tasks/AddTaskButton";

export default function TaskPage() {
  return (
        <Box>
          <NavBar />
          <Container maxWidth="false" sx={{bgcolor: "black", height:"85vh"}}>
            <Stack direction="row" spacing={5} sx={{height: "100%", px:10, py:5, bgcolor: "pink", boxSizing: "border-box"}}>
              <BookPage>
                <Stack direction="column" spacing={2} sx={{ width:"100%", height:"85vh", display: "flex"}}>
                  <Typography variant="h6">My Tasks</Typography>
                  <AddTaskButton />
                </Stack>
              </BookPage>
              <BookPage>
                <Typography variant="h6">My Metrics</Typography>
              </BookPage>
            </Stack>
          </Container>
        </Box>
      );
}