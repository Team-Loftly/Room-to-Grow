import { useEffect, useState } from "react";
import {
  Stack,
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
  removeFriend,
  selectFriendsStatus,
  selectFriendsError,
  selectFriends,
  clearError,
  setCurrentFriend,
  selectCurrentFriend
} from "../features/friendsSlice";

function FriendsComponent() {
  const dispatch = useDispatch();
  const friends = useSelector(selectFriends);
  const status = useSelector(selectFriendsStatus);
  const error = useSelector(selectFriendsError);
  const disallowedCharacters = /[<>"'\/\\]/;
  const friendUsername = useSelector(selectCurrentFriend);
  const [searchFriend, setSearchFriend] = useState("");
  const [inputError, setInputError] = useState("");

  // fetch items on mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFriends());
    }
  }, [dispatch, status]);

  const handleAddFriend = () => {
    if (searchFriend.trim()) {
      dispatch(addFriend(searchFriend));
    }
  };

  const handleDeleteFriend = (friend) => {
    dispatch(removeFriend(friend));
  }

  // switch currentRoomUsername to given name
  // fetch and display the friend's room
  const switchRoom = function (name) {
    dispatch(setCurrentFriend(name));
  };

  const handleChangeUsername = (usr) => {
    if (disallowedCharacters.test(usr)) {
      setInputError("Input contains invalid characters!");
    } else {
      setInputError("");
      setSearchFriend(usr);
    }
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
        {friendUsername && <Typography>Now viewing {friendUsername}'s room.</Typography>}
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
                <Button
                  onClick={() => {
                    handleDeleteFriend(friend);
                    if (friend === friendUsername) {
                      switchRoom(null);
                    }
                  }}
                >
                  Remove
                </Button>
              </ListItem>
            ))
          )}
        </List>

        <Stack direction="row" spacinga={2}>
          <TextField
            fullWidth
            label="Friend's Username"
            value={searchFriend}
            onChange={(e) => handleChangeUsername(e.target.value)}
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
        {inputError && (
          <Alert severity="error" onClose={() => setInputError("")} sx={{ mb: 2, width: '100%' }}>
            {inputError}
          </Alert>
        )}
      </Box>
  );
}

export default FriendsComponent;
