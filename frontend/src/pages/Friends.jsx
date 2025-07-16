import { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriends,
  addFriend,
  selectFriendsStatus,
  selectFriendsError,
  selectFriends,
  clearError,
} from "../features/friendsSlice";
import Room from "../components/Room.jsx";
import FriendsComponent from "../components/Friends.jsx";

function Friends() {
  const dispatch = useDispatch();
  const friends = useSelector(selectFriends);
  const status = useSelector(selectFriendsStatus);
  const error = useSelector(selectFriendsError);

  const [friendUsername, setFriendUsername] = useState("");
  // start off with viewing your room
  const [currentRoomUsername, setCurrentRoomUsername] = useState(
    localStorage.getItem("username")
  );

  // fetch items on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFriends());
    }
  }, [dispatch, status]);

  const handleAddFriend = () => {
    if (friendUsername.trim()) {
      dispatch(addFriend(friendUsername));
      setFriendUsername("");
    }
  };

  // switch currentRoomUsername to given name
  // fetch and display the friend's room
  const switchRoom = function (name) {
    setCurrentRoomUsername(name);
  };

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
      }}
    >
    <Room friendUsername={currentRoomUsername}></Room>
    <FriendsComponent />
    </Stack>
  );
}

export default Friends;
