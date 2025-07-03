import express from "express";
import StatusCodes from "http-status-codes";
import { requireAuth } from "../util/AuthHelper.js";
import Rooms from "../models/Rooms.js";

const router = express.Router();

export default function createInventoryRouter(requireAuth) {
  // get room by Id
  router.get("/", requireAuth, async (req, res) => {
    const room_id = req.roomId;
    try {
      // TODO: Get check that the roomId belongs to the current user
      const room = await Rooms.findOne({ roomId: room_id });
      res.status(StatusCodes.OK).json(room);
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error retrieving room" });
    }
  });

  // create a new inventory for the user
  router.post("/create", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const inventory = req.body.inventory;
    const coins = req.body.coins;
    // TODO: Server side input validation
    try {
      // check if an inventory already exists for the user
      const existingInventory = await Inventory.findOne({ userId: user_id });
      if (existingInventory) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Inventory already exists" });
      }
      // create and save a new inventory
      const newInventory = new Inventory({
        userId: user_id,
        coins: coins || 1000,
        decorations: inventory || [],
      });
      await newInventory.save();
      // return the populated inventory
      const populatedInventory = await Inventory.findOne({
        userId: user_id,
      }).populate("decorations");
      res.status(StatusCodes.CREATED).json(populatedInventory);
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error creating inventor" });
    }
  });

  // update the user's room
  router.post("/update", requireAuth, async (req, res) => {
    const room_id = req.roomId;
    const decorations = req.body.decorations;
    try {
      const updatedRoom = await Inventory.findOneAndUpdate(
        { roomId: room_id },
        {
          $set: {
            decorations: decorations,
          },
        },
        { new: true } // return the updated document
      );

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
