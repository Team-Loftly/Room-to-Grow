import express from "express";
import StatusCodes from "http-status-codes";
import User from "../models/Users.js";

const router = express.Router();

export default function createFriendsRouter(requireAuth) {
  // get the user's friends by ID
  router.get("/", requireAuth, async (req, res) => {
    const user_id = req.userId;
    try {
      const user = await User.findOne({ _id: user_id });
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "User not found" });   
      }
      const friends = user.friends;

      res.status(StatusCodes.OK).json(friends);
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error retrieving friends" });
    }
  });

  // add a friend for the user by the friend's username
  router.post("/add", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const friendUsername = req.body.username;
    try {
      const user = await User.findOne({ _id: user_id });
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      }
      // Prevent adding yourself
      if (user.username === friendUsername) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Cannot add yourself as a friend" });
      }
      // Check if the friend user exists
      const friend = await User.findOne({ username: friendUsername });
      if (!friend) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Friend not found" });
      }
      // Check if friend is already in friends list
      if (user.friends.includes(friend.username)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "User is already your friend" });
      }
      // Add friend's username to user's friends list and vice-versa
      user.friends.push(friend.username);
      friend.friends.push(user.username);
      await user.save();
      await friend.save();
      res.status(StatusCodes.OK).json({ message: "Friend added successfully", friends: user.friends });
    } catch (err) {
        console.log(err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Error adding friend" });
      }
    });
  return router;
}
