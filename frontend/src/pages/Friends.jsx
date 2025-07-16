import { useEffect, useState } from "react";
import {
  Stack,
  Divider,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
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
      <Box
      flexDirection="column"
      sx={{
        width: "40%",
        display: "flex",
        bgcolor: "rgba(255, 255, 255, 0.8)",
        m: 4,
        py: 3,
        padding: 4,
        borderRadius: 4,
      }}
      >
        <Typography variant="h5">Friends</Typography>
        <Typography>Now viewing {currentRoomUsername}'s room.</Typography>
        <List>
          {friends.length === 0 ? (
            <Typography>No friends yet.</Typography>
          ) : (
            friends.map((friend, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={friend} />
                <Button
                  onClick={() => {
                    switchRoom(friend);
                  }}
                >
                  View
                </Button>
              </ListItem>
            ))
          )}
        </List>

        <Stack direction="row" spacinga={2}>
          <TextField
            fullWidth
            label="Friend's Username"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            variant="outlined"
          />
          <Button variant="contained" onClick={handleAddFriend}>
            Add
          </Button>
        </Stack>
        {error && (
          <Alert severity="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}
      </Box>
    </Stack>
  );
}

export default Friends;
