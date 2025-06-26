import express from "express";
import StatusCodes from "http-status-codes";
import { requireAuth } from "../util/AuthHelper.js";

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
    // req.userId will be the user's id (decoded from the auth token)
    res.status(StatusCodes.OK).json({ result: {
      hoursSpent: {
        "This Week": 10,
        "Last Week": 5,
        Total: 20,
      },
      tasksCompleted: {
        "This Week": 20,
        "Last Week": 10,
        Total: 50,
      },
    
      categoryHours: {
        Coded: 4,
        Read: 6,
        Exercised: 2,
        "Played Piano": 10,
      },
    } });
  });

  export default router;