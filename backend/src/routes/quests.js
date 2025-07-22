import express from "express";
import StatusCodes from "http-status-codes";
import { requireAuth } from "../util/AuthHelper.js";
import Quest from "../models/Quest.js";

const router = express.Router();

// get list of quests
router.get("/", requireAuth, async (req, res) => {
  try {
    const quests = await Quest.find();
    res.status(StatusCodes.OK).json(quests);
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving quests" });
  }
});

export default router;
