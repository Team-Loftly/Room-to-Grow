import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import BookPage from "../components/tasks/BookPage";
import StatPage from "../components/tasks/right_page/SelectedTask";
import MyTasks from "../components/tasks/left_page/MyTasks";
import Book from "../assets/Book.png";

export default function Tasks() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#1E2939",
      }}
    >
      <Stack
        direction="row"
        spacing={4}
        sx={{
          height: "95%",
          width: "90%",
          pt: 5,
          px: 7,
          pb: 10,
          bgcolor: "#1E2939",
          backgroundImage: `url(${Book})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          boxSizing: "border-box",
        }}
      >
        <BookPage>
          <MyTasks />
        </BookPage>
        <BookPage>
          <StatPage />
        </BookPage>
      </Stack>
    </Box>
  );
}
