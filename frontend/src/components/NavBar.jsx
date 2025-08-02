import {
  Box,
  Tooltip,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Stack,
  Badge,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectInventoryCoins,
  selectInventoryError,
  selectInventoryStatus,
  fetchRoom,
} from "../features/roomSlice";
import { useEffect } from "react";
import ProfileDropdown from "./ProfileDropdown";
import PaidIcon from "@mui/icons-material/Paid";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { selectHasUnseenCompletedQuest } from "../features/dailyQuestSetSlice";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const coins = useSelector(selectInventoryCoins);
  const status = useSelector(selectInventoryStatus);
  const error = useSelector(selectInventoryError);
  const currentUserName = localStorage.getItem("username");

  const hasUnseenCompletedQuest = useSelector(selectHasUnseenCompletedQuest);

  useEffect(() => {
    dispatch(fetchRoom());
  }, [dispatch]);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0a571f" }}>
      <Toolbar
        sx={{
          minHeight: { xs: "64px", sm: "80px" },
        }}
      >
        <Box sx={{ flexGrow: 1, fontFamily: "Caveat" }}>
          <Tooltip title="Home" arrow>
            <Typography
              className="hover:cursor-pointer"
              variant="h4"
              component="div"
              sx={{ width: 180, fontFamily: "Caveat" }}
              onClick={() => navigate("/home")}
            >
              Room to Grow
            </Typography>
          </Tooltip>
        </Box>

        <Stack direction="row" spacing={3} alignItems="center">
          <Tooltip title="Go to Quests" arrow>
            <Button
              color="inherit"
              onClick={() => {
                navigate("/quests");
              }}
              sx={{ textTransform: "none" }}
            >
              <Badge
                color="error"
                variant="dot"
                invisible={!hasUnseenCompletedQuest}
                sx={{
                  "& .MuiBadge-badge": {
                    top: 8,
                    right: 8,
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontFamily: "Be Vietnam Pro", fontWeight: 300 }}
                >
                  Quests <EmojiEventsIcon fontSize="large" className="mb-1" />
                </Typography>
              </Badge>
            </Button>
          </Tooltip>

          {status === "failed" ? (
            <Typography color="error">Error: {error}</Typography>
          ) : (
            <Tooltip title="Go to Marketplace" arrow>
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
                  {coins}{" "}
                  <PaidIcon fontSize="large" className="text-yellow-500" />
                </Typography>
              </Button>
            </Tooltip>
          )}
          <Box sx={{ mr: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontFamily: "Be Vietnam Pro", fontWeight: 300 }}
            >
              Welcome {currentUserName}
            </Typography>
          </Box>
          <ProfileDropdown />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
