import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

// nav bar that includes common functionality like log out, go to home, etc
// should be included on every page except login/register
export default function NavBar() {
  const navigate = useNavigate();

  const logoutUser = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            className="hover:cursor-pointer"
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => navigate("/home")}
          >
            Room to Grow
          </Typography>
          <Button onClick={logoutUser} color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
