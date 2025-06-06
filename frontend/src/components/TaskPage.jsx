import NavBar from "./NavBar";
import { Box, Container } from "@mui/material";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import BookPage from "./tasks/BookPage";
import StatPage from "./StatPage";
import MyTasks from "./tasks/MyTasks";
import React from "react";
import { useState } from "react";
import Book from "../assets/Book.png";

export default function TaskPage() {
  return (
    <Box
      sx={{
        height: "100vh",
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
          height: "95vh",
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
