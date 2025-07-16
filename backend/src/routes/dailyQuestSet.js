import express from "express";
import StatusCodes from "http-status-codes";
import DailyQuestSet from "../models/DailyQuestSet.js";
import Quest from "../models/Quest.js";
import Rooms from "../models/Rooms.js";
import { requireAuth } from "../util/AuthHelper.js";
import { startOfDay } from "date-fns";

export default function createDailyQuestSetRouter(requireAuth) {
  const router = express.Router();

  // Get the user's daily quests, or generate a new set if today's doesn't exist yet
  router.get("/", requireAuth, async (req, res) => {
    const userId = req.userId;
    const currentDate = startOfDay(new Date());

    // Search for user's daily quest list for today
    try {
      let dailyQuestSet = await DailyQuestSet.findOne({
        userId: userId,
        date: currentDate,
      });

      // If no result is found, create a set of daily quests
      if (!dailyQuestSet) {
        const randomizedQuests = await Quest.aggregate([
          { $sample: { size: 3 } },
        ]);

        const questList = randomizedQuests.map((quest) => ({
          questId: quest._id,
          isCompleted: false,
        }));

        dailyQuestSet = new DailyQuestSet({
          userId: userId,
          date: currentDate,
          reward: 50,
          isComplete: false,
          isRewardClaimed: false,
          quests: questList,
        });

        await dailyQuestSet.save();
      }

      dailyQuestSet = await dailyQuestSet.populate({
        path: "quests.questId",
        model: "Quest",
        select: "name description reward image",
      });

      res.status(StatusCodes.OK).json(dailyQuestSet);
    } catch (err) {
      console.error("Error fetching daily quests:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  });

  // Marks a quest as complete and rewards the user with coins
  router.put(
    "/:dailyQuestSetId/complete/:questId",
    requireAuth,
    async (req, res) => {
      const userId = req.userId;
      const { dailyQuestSetId, questId } = req.params;

      try {
        const dailyQuestSet = await DailyQuestSet.findOne({
          _id: dailyQuestSetId,
          userId: userId,
          date: startOfDay(new Date()),
        }).populate({
          path: "quests.questId",
          model: "Quest",
          select: "name description reward image",
        });

        if (!dailyQuestSet) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "Error locating daily quests.",
          });
        }

        // Find the specific dailyQuest subdocument by its questId
        const targetDailyQuest = dailyQuestSet.quests.find(
          (dailyQ) =>
            dailyQ.questId && dailyQ.questId._id.toString() === questId
        );

        if (!targetDailyQuest) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Individual quest not found in this daily set." });
        }

        if (targetDailyQuest.isComplete) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Quest already completed." });
        }

        // Mark as complete and award individual quest coins
        targetDailyQuest.isComplete = true;
        const room = await Rooms.findOne({ userId: userId });
        room.coins += targetDailyQuest.questId.reward;
        await room.save();

        // Check if all quests in the set are now complete
        const allQuestsDone = dailyQuestSet.quests.every((q) => q.isComplete);
        if (allQuestsDone && !dailyQuestSet.isComplete) {
          dailyQuestSet.isComplete = true;
        }
        await dailyQuestSet.save();

        res.status(StatusCodes.OK).json({
          message: "Quest marked as complete and reward granted!",
          updatedDailyQuestSet: dailyQuestSet,
          currentUserCoins: room.coins, // Send updated coins back
        });
      } catch (err) {
        console.error("Error completing individual daily quest:", err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Internal server error" });
      }
    }
  );

  return router;
}
