import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField, Button, Box, Paper } from "@mui/material";
import SiteHeader from "./SiteHeader";
export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // go straight to home if the user is currently logged in
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      navigate("/home");
    }
  }, []);

  const registerUser = () => {
    // register new user using email, password
    // uses localStorage for now -- replace with backend calls later
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.email === email)) {
      // user already exists
      alert("user already exists!!");
      return;
    }
    // register new user and go to home
    if (email !== "" && password !== "") {
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify({ email }));
      navigate("/home");
    } else {
      alert("Invalid email/password!");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "400px",
          width: "400px",
        }}
      >
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          onSubmit={registerUser}
          gap={1}
        >
          <SiteHeader />
          <TextField
            label="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="outlined">
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
