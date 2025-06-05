import NavBar from "./NavBar";
import { Box, Container } from "@mui/material";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import BookPage from "./tasks/BookPage";
import StatPage from "./StatPage";
import MyTasks from "./tasks/MyTasks";
import React from "react";
import { useState } from "react";

export default function TaskPage() {
  return (
    <Box>
      <NavBar />
      <Container maxWidth="false" sx={{ bgcolor: "black", height: "85vh" }}>
        <Stack
          direction="row"
          spacing={5}
          sx={{
            height: "100%",
            px: 10,
            py: 5,
            bgcolor: "pink",
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
      </Container>
    </Box>
  );
}
