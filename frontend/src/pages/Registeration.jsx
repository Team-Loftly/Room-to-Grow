import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField, Button, Box, Paper, Alert } from "@mui/material";
import SiteHeader from "../components/SiteHeader";
import { createInventory } from "../features/inventorySlice";
import { useDispatch } from "react-redux";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // if we're already logged in, navigate straight to home.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }
      // registration was successful
      localStorage.setItem("token", data.token);
      // create a new inventory for the user
      dispatch(createInventory());
      // set the current user's username
      localStorage.setItem("username", username);
      // nav to home
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again later.");
    }
  };

  const goToLogin = () => navigate("/");

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: 450,
          display: "flex",
          flexDirection: "column",
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
        >
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
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
          <Button type="submit" variant="contained" fullWidth>
            Register
          </Button>
          <Button variant="outlined" onClick={goToLogin} fullWidth>
            Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
