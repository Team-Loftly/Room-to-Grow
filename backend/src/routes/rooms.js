import express from "express";
import StatusCodes from "http-status-codes";
import { requireAuth } from "../util/AuthHelper.js";
import Rooms from "../models/Rooms.js";
import Decorations from "../models/Decorations.js";

const router = express.Router();

export default function createRoomRouter(requireAuth) {
  // get room by Id
  router.get("/", requireAuth, async (req, res) => {
    const user_id = req.userId;
    try {
      // TODO: Get check that the roomId belongs to the current user
      const room = await Rooms.findOne({ userId: user_id })
        .populate("decorations")
        .populate("decorations.decorId"); // populate the decorId so full decoration details are available

      if (!room) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Room not found for this user" });
      }

      res.status(StatusCodes.OK).json(room);
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error retrieving room" });
    }
  });

  // create a new room for the user
  router.post("/create", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const decorations = req.body.decorations;
    const coins = req.body.coins;
    // TODO: Server side input validation
    try {
      // check if a room already exists for the user
      const existingRoom = await Rooms.findOne({ userId: user_id });
      if (existingRoom) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Room already exists" });
      }
      // create and save a new room
      const newRoom = new Rooms({
        userId: user_id,
        coins: coins || 1000,
        decorations: decorations || [],
      });
      await newRoom.save();
      // return the populated room
      const populatedRoom = await Rooms.findOne({
        userId: user_id,
      }).populate("decorations");
      res.status(StatusCodes.CREATED).json(populatedRoom);
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error creating room" });
    }
  });

  // update the user's room
  router.post("/update", requireAuth, async (req, res) => {
    const user_id = req.userId;
    // req.body.decorations contains objects with
    // 'model' (string), 'position', 'rotation'
    const clientDecorations = req.body.decorations;
    const coins = req.body.coins;
    // TODO: Add server side validation

    try {
      const updatedRoom = await Rooms.findOneAndUpdate(
        { userId: user_id },
        {
          $set: {
            coins: coins,
            decorations: clientDecorations, // Use the transformed array with ObjectIds
          },
        },
        { new: true } // return the updated document
      ).populate("decorations"); // Still populate for the response to send back full details

      if (!updatedRoom) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Room not found" });
      }

      res.status(StatusCodes.OK).json(updatedRoom);
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error updating room" });
    }
  });
  return router;
}
