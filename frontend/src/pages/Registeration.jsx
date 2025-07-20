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
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"; 

import SiteHeader from "../components/SiteHeader";
import loginIllustration from "../assets/login.png";
import { createInventory } from "../features/inventorySlice";
import { useDispatch } from "react-redux";

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const IllustrationSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    minHeight: '300px',
  },
  backgroundImage: `url(${loginIllustration})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}));

const RegisterFormSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: theme.spacing(4),
  maxWidth: '500px',
  margin: 'auto',
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    alignItems: 'center',
    maxWidth: '100%',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
}));

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
    <PageContainer>
      <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 100 }}>
        <SiteHeader />
      </Box>

      <IllustrationSection>
      </IllustrationSection>

      <RegisterFormSection>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create New Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'left' }}>
          Join now to start growing!
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={registerUser}
          sx={{ width: '100%' }}
        >
          <StyledTextField
            fullWidth
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
            }}
          />

          <StyledTextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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

          <Box sx={{ display: 'flex', gap: 2, width: '100%',
            '@media (max-width: 600px)': {
              flexDirection: 'column',
              gap: 1,
            }
          }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                flexGrow: 1,
                backgroundColor: '#0a571f', // Dark green for Login Now
                '&:hover': {
                  backgroundColor: '#119e38',
                },
                borderRadius: '8px',
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              onClick={goToLogin}
              sx={{
                flexGrow: 1,
                borderColor: '#e0e0e0',
                color: '#333',
                '&:hover': {
                  borderColor: '#ccc',
                  backgroundColor: '#f5f5f5',
                },
                borderRadius: '8px',
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Back
            </Button>
          </Box>
        </Box>
      </RegisterFormSection>
    </PageContainer>
  );
}