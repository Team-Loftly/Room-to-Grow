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
import ProfileDropdown from "./ProfileDropdown";
import PaidIcon from "@mui/icons-material/Paid";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
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

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0a571f" }}>
      <Toolbar
        sx={{
          minHeight: { xs: "64px", sm: "80px" },
        }}
      >
        <Typography
          className="hover:cursor-pointer"
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "Caveat" }}
          onClick={() => navigate("/home")}
        >
          Room to Grow
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center">
          <Button
            color="inherit"
            onClick={() => {
              console.log("Quest button pressed");
            }}
            sx={{ textTransform: "none" }}
          >
            <Typography
              variant="body1"
              sx={{ fontFamily: "Be Vietnam Pro", fontWeight: 300 }}
            >
              Quests <EmojiEventsIcon className="mb-1" />
            </Typography>
          </Button>

          {status === "failed" ? (
            <Typography color="error">Error: {error}</Typography>
          ) : (
          <Button
            color="inherit"
            onClick={() => {
              navigate("/marketplace");
            }}
            sx={{ textTransform: "none" }}
          >
            <Typography
              variant="body1"
              sx={{ fontFamily: "Be Vietnam Pro", fontWeight: 300 }}
            >
              {coins} <PaidIcon className="text-yellow-500" />
            </Typography>
          </Button>
          )}
          <ProfileDropdown />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
