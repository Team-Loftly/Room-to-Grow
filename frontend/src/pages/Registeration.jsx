import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField, Button, Box, Paper, Alert } from "@mui/material";
import SiteHeader from "../components/SiteHeader";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // go to home if user is already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      navigate("/home");
    }
  }, [navigate]);

  const registerUser = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((user) => user.email === email)) {
      setError("User already exists");
      return;
    }

    if (!email || !password) {
      setError("Invalid email or password");
      return;
    }

    // Register new user
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify({ email }));
    navigate("/home");
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
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 450,
          gap: 2,
        }}
      >
        <SiteHeader />
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={registerUser}
          display="flex"
          flexDirection="column"
          gap={2}
          width="100%"
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="outlined" fullWidth>
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
