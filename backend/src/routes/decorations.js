import express from "express";
import StatusCodes from "http-status-codes";
import { requireAuth } from "../util/AuthHelper.js";
import Decorations from "../models/Decorations.js";

const router = express.Router();

// get list of decorations
router.get("/", requireAuth, async (req, res) => {
  try {
    const decorations = await Decorations.find();
    res.status(StatusCodes.OK).json(decorations);
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error retrieving decorations" });
  }
});

export default router;
