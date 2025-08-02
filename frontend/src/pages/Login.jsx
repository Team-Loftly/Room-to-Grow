import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import SiteHeader from "../components/SiteHeader";
import loginIllustration from "../assets/login.png";
import { fetchRoom } from "../features/roomSlice";
import { fetchDailyQuests } from "../features/dailyQuestSetSlice";
import { useDispatch } from "react-redux";

const PageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const IllustrationSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    minHeight: "300px",
  },
  backgroundImage: `url(${loginIllustration})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}));

const LoginFormSection = styled(Box)(({ theme }) => ({
  flex: "0 0 40%",
  minWidth: "40%",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: theme.spacing(4),
  maxWidth: "500px",
  margin: "auto",
  backgroundColor: "#fff",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  // Adjust padding and alignment for smaller screens
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
    alignItems: "center",
    maxWidth: "100%",
    flexBasis: "auto",
    minWidth: "auto",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
}));

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const disallowedCharacters = /[<>"'\/\\]/;

  // if logged in, navigate straight to home
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
      localStorage.setItem("username", data.username);
      dispatch(fetchRoom());
      dispatch(fetchDailyQuests());
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again later.");
    }
  };

  const handleChangeEmail = (email) => {
    if (disallowedCharacters.test(email)) {
      setError("Input contains invalid characters!");
    } else {
      setError("");
      setEmail(email);
    }
  };

  const handleChangePassword = (password) => {
    if (disallowedCharacters.test(password)) {
      setError("Input contains invalid characters!");
    } else {
      setError("");
      setPassword(password);
    }
  };

  const goToRegister = () => navigate("/register");

  return (
    <PageContainer>
      <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 100 }}>
        <SiteHeader />
      </Box>

      <IllustrationSection></IllustrationSection>

      <LoginFormSection>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Welcome Back :)
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: "left" }}
        >
          Login to start your day! <br />
          Remember, we still have Room to Grow :)
        </Typography>

        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 2, width: "100%" }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={loginUser} sx={{ width: "100%" }}>
          <StyledTextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => handleChangeEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />

          <StyledTextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => handleChangePassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              mb: 3,
              "@media (max-width: 600px)": {
                flexDirection: "column",
                gap: 1,
              },
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                flexGrow: 1,
                backgroundColor: "#0a571f", // Dark green for Login Now
                "&:hover": {
                  backgroundColor: "#119e38",
                },
                borderRadius: "8px",
                py: 1.5,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Login Now
            </Button>
            <Button
              variant="outlined"
              onClick={goToRegister}
              sx={{
                flexGrow: 1,
                borderColor: "#e0e0e0",
                color: "#333",
                "&:hover": {
                  borderColor: "#ccc",
                  backgroundColor: "#f5f5f5",
                },
                borderRadius: "8px",
                py: 1.5,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </LoginFormSection>
    </PageContainer>
  );
}
