import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField, Button, Box, Paper, Alert } from "@mui/material";
import SiteHeader from "../components/SiteHeader";
import { fetchInventory } from "../features/inventorySlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // if we're logged in, navigate straight to home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }
      // login was successful
      localStorage.setItem("token", data.token);
      // fetch the user's inventory and store it in the slice
      dispatch(fetchInventory());
      // navigate to home
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again later.");
    }
  };

  const goToRegister = () => navigate("/register");

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={8} sx={{ p: 4, width: 450, display: "flex", flexDirection: "column", gap: 2 }}>
        <SiteHeader />
        {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
        <Box component="form" onSubmit={loginUser} display="flex" flexDirection="column" gap={2}>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
          <Button type="submit" variant="outlined" fullWidth>Login</Button>
          <Button variant="outlined" onClick={goToRegister} fullWidth>Register</Button>
        </Box>
      </Paper>
    </Box>
  );
}
