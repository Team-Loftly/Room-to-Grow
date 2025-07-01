import express from "express";
import StatusCodes from "http-status-codes";
import { requireAuth } from "../util/AuthHelper.js";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// get user's inventory
router.get("/", requireAuth, async (req, res) => {
  const user_id = req.userId;
  try {
    // replaces decoration ids with their objects from the Decorations collection
    const inventory = await Inventory.findOne({ userId: user_id }).populate(
      "decorations"
    );
    if (!inventory) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Inventory not found" });
    }
    res.status(StatusCodes.OK).json(inventory);
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving inventory" });
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

// update the user's inventory
router.post("/update", requireAuth, async (req, res) => {
  const user_id = req.userId;
  const decorations = req.body.decorations;
  const coins = req.body.coins;
  // TODO: Add server side va
  try {
    const updatedInventory = await Inventory.findOneAndUpdate(
      { userId: user_id },
      {
        $set: {
          coins: coins,
          decorations: decorations,
        },
      },
      { new: true } // return the updated document
    ).populate("decorations");

    if (!updatedInventory) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Inventory not found" });
    }

    res.status(StatusCodes.OK).json(updatedInventory);
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating inventory" });
  }
});

export default router;
