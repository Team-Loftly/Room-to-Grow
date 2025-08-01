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

  router.get("/friendRequests", requireAuth, async (req, res) => {
    const user_id = req.userId;
    try {
      const user = await User.findOne({ _id: user_id });
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "User not found" });   
      }
      const friendRequests = user.friendRequests;

      res.status(StatusCodes.OK).json(friendRequests);
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error retrieving friends" });
    }
  });

  // add a friend for the user by the friend's username
  // APPROVE REQUEST
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
      if (!user.friendRequests.includes(friend.username)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "User did not send you a friend req." });
      }
      // Add friend's username to user's friends list and vice-versa
      user.friends.push(friend.username);
      // remove friend request from you requests and vice versa
      user.friendRequests = user.friendRequests.filter(username => username !== friend.username);
      friend.friendRequests = friend.friendRequests.filter(username => username !== user.username);
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

    // remove friend
    // REMOVE ADDED FRIEND
    router.delete("/remove", requireAuth, async (req, res) => {
      const user_id = req.userId;
      const friendUsername = req.body.username;
      try {
        const user = await User.findOne({ _id: user_id });
        if (!user) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
  
        const friend = await User.findOne({ username: friendUsername });
        if (!friend) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "Friend not found" });
        }
  
        // Remove friend from user's list
        user.friends = user.friends.filter(username => username !== friendUsername);
        // Remove user from friend's list
        friend.friends = friend.friends.filter(username => username !== user.username);
  
        await user.save();
        await friend.save();
  
        res.status(StatusCodes.OK).json({ message: "Friend removed successfully", friends: user.friends });
      } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error removing friend" });
      }
    });

      // SEND REQUEST
  router.post("/addRequest", requireAuth, async (req, res) => {
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
      // Add yourself to friend's request list
      if (!friend.friendRequests.includes(user.username)) {
        friend.friendRequests.push(user.username);
      }
      await friend.save();
      res.status(StatusCodes.OK).json({ message: "Friend added successfully", friends: user.friends });
    } catch (err) {
        console.log(err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Error adding friend" });
      }
    });

    // REMOVE RECEIVED REQUEST
    router.delete("/removeRequest", requireAuth, async (req, res) => {
      const user_id = req.userId;
      const friendUsername = req.body.username;
      try {
        const user = await User.findOne({ _id: user_id });
        if (!user) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
  
        const friend = await User.findOne({ username: friendUsername });
        if (!friend) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "Friend not found" });
        }
  
        // Remove friend from user's list
        user.friendRequests = user.friendRequests.filter(username => username !== friendUsername);
        await user.save();
  
        res.status(StatusCodes.OK).json({ message: "Friend removed successfully", friends: user.friends });
      } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error removing friend" });
      }
    });
  return router;
}
