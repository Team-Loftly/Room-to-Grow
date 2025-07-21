import express from "express";
import StatusCodes from "http-status-codes";
import DailyQuestSet from "../models/DailyQuestSet.js";
import Quest from "../models/Quest.js";
import Rooms from "../models/Rooms.js";

export default function createDailyQuestSetRouter(requireAuth) {
  const router = express.Router();

  // Get the user's daily quests, or generate a new set if today's doesn't exist yet
  router.get("/", requireAuth, async (req, res) => {
    const getStartOfDayLocal = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };
    const userId = req.userId;
    const currentDate = getStartOfDayLocal(new Date());

    // Search for the user's quest set for today
    try {
      let dailyQuestSet = await DailyQuestSet.findOne({
        userId: userId,
        date: currentDate,
      });

      // If no result is found, create a set of quests for today
      if (!dailyQuestSet) {
        const randomizedQuests = await Quest.aggregate([
          { $sample: { size: 3 } },
        ]);

        const questList = randomizedQuests.map((quest) => ({
          questId: quest._id,
          isComplete: false,
          progress: 0,
        }));

        dailyQuestSet = new DailyQuestSet({
          userId: userId,
          date: currentDate,
          reward: 25,
          isComplete: false,
          isRewardClaimed: false,
          quests: questList,
        });

        await dailyQuestSet.save();
      }

      dailyQuestSet = await dailyQuestSet.populate({
        path: "quests.questId",
        model: "Quest",
        select: "name description reward image relatedHabitType targetValue",
      });

      res.status(StatusCodes.OK).json(dailyQuestSet);
    } catch (err) {
      console.error("Error fetching daily quests:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  });

  router.post("/:id/claim-bonus", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const dailyQuestSetId = req.params.id;

    const questSet = await DailyQuestSet.findOne({
      _id: dailyQuestSetId,
      userId: user_id,
    });

    if (questSet.isComplete && !questSet.isRewardClaimed) {
      const room = await Rooms.findOne({ userId: user_id });
      room.coins += questSet.reward;
      questSet.isRewardClaimed = true;
      await room.save();
      await questSet.save();

      return res
        .status(StatusCodes.OK)
        .json({ questSet, newCoins: room.coins });
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Reward cannot be claimed." });
    }
  });

  return router;
}
