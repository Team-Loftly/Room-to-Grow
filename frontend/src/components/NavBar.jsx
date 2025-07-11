import { Box, AppBar, Toolbar, Button, Typography, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectInventoryCoins,
  selectInventoryError,
  selectInventoryStatus,
} from "../features/inventorySlice";
import { fetchInventory } from "../features/inventorySlice";
import { useEffect } from "react";
// nav bar that includes common functionality like log out, go to home, etc
// should be included on every page except login/register
export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const coins = useSelector(selectInventoryCoins);
  const status = useSelector(selectInventoryStatus);
  const error = useSelector(selectInventoryError);

  // fetch items on mount
  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // handle loading and error
  if (status === "loading") {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Typography>Loading</Typography>
      </Stack>
    );
  }

  const logoutUser = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "#0a571f" }}>
      <Toolbar>
        <Typography
          className="hover:cursor-pointer"
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "Caveat" }}
          onClick={() => navigate("/home")}
        >
          Room to Grow
        </Typography>

        {status === "failed" ? (
          <Typography color="error">Error: {error}</Typography>
        ) : (
          <Box sx={{ mr: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontFamily: "Be Vietnam Pro", fontWeight: 300 }}
            >
              {coins} coins
            </Typography>
          </Box>
        )}
        <Button
          onClick={logoutUser}
          color="inherit"
          sx={{ fontFamily: "Be Vietnam Pro", fontWeight: 400 }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
