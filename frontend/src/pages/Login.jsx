import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField, Button, Box, Paper } from "@mui/material";
import SiteHeader from "../components/SiteHeader";

// Login Content
export default function Login() {
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

  const loginUser = () => {
    // login existing user using localStorage for now -- replace with backend calls later
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (
      !users.find((user) => user.email === email && user.password === password)
    ) {
      alert("Incorrect Email/Password!");
      return;
    }
    // login successful
    localStorage.setItem("currentUser", JSON.stringify({ email }));
    navigate("/home");
  };

  const registerUser = () => {
    navigate("/register");
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
          onSubmit={loginUser}
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
            Login
          </Button>
          <Button variant="outlined" onClick={registerUser}>
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
