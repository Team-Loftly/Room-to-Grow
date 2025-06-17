import { Box, AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectInventoryCoins } from "../features/inventorySlice";
// nav bar that includes common functionality like log out, go to home, etc
// should be included on every page except login/register
export default function NavBar() {
  const navigate = useNavigate();
  const coins = useSelector(selectInventoryCoins);

  const logoutUser = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          className="hover:cursor-pointer"
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          onClick={() => navigate("/home")}
        >
          Room to Grow
        </Typography>

        <Box sx={{ mr: 2 }}>
          <Typography variant="body1">{coins} coins</Typography>
        </Box>

        <Button onClick={logoutUser} color="inherit">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
