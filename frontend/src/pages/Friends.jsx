import { useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriends,
  selectFriendsStatus,
  selectCurrentFriend,
} from "../features/friendsSlice";
import Room from "../components/Room.jsx";
import FriendsComponent from "../components/Friends.jsx";
import BackButton from "../components/BackButton.jsx";

function Friends() {
  const dispatch = useDispatch();
  const status = useSelector(selectFriendsStatus);

  const friendUsername = useSelector(selectCurrentFriend);

  // fetch items on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFriends());
    }
  }, [dispatch, status]);

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
    <Stack
      direction="row"
      sx={{
        height: "100%",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <BackButton />
      <Room friendUsername={friendUsername}></Room>
      <FriendsComponent />
    </Stack>
  );
}

export default Friends;
