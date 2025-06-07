import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField, Button, Box, Paper, Alert } from "@mui/material";
import SiteHeader from "../components/SiteHeader";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // go straight to home if the user is currently logged in
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      navigate("/home");
    }
  }, [navigate]);

  const loginUser = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      setError("Incorrect Email or Password");
      return;
    }

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
          onSubmit={loginUser}
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
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="outlined" fullWidth>
            Login
          </Button>
          <Button variant="outlined" onClick={registerUser} fullWidth>
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
