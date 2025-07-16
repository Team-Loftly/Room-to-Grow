import { useEffect, useState } from "react";
import { Stack, Divider, Typography, List, ListItem, ListItemText, TextField, Button, Alert} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends, 
    addFriend, 
    selectFriendsStatus, 
    selectFriendsError, 
    selectFriends,
    clearError } from "../features/friendsSlice";
import Room from "../components/Room.jsx";

function Friends() {
  const dispatch = useDispatch();
  const friends = useSelector(selectFriends);
  const status = useSelector(selectFriendsStatus);
  const error = useSelector(selectFriendsError);

  const [friendUsername, setFriendUsername] = useState("");
  // start off with viewing your room
  const [currentRoomUsername, setCurrentRoomUsername] = useState(localStorage.getItem("username"));

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
  const switchRoom = function(name) {
    setCurrentRoomUsername(name);

  }

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
      direction="column"
      sx={{
        height: "100%",
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        {/*Display the friends data*/}
    <Typography variant="h5" align="center">
    Your Friends
    </Typography>
    <List>
        {friends.length === 0 ? (
          <Typography>No friends yet.</Typography>
        ) : (
          friends.map((friend, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText primary={friend} />
              <Button onClick={()=>{switchRoom(friend)}}>View</Button>
            </ListItem>
          ))
        )}
    </List>
    <Divider />

    <Stack direction="row" spacing={2}>
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
    <Typography variant="h5" align="center">
    Visit your friend's room
    </Typography>
    <Typography variant="b1" align="center">
    Now viewing {currentRoomUsername}'s room!
    </Typography>
    <Room friendUsername={currentRoomUsername}>
    </Room>
    </Stack>
  );
}

export default Friends;
