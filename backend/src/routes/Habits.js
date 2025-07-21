import express from "express";
import StatusCodes from "http-status-codes";
import Habit from "../models/Habit.js";
import DailyQuestSet from "../models/DailyQuestSet.js";
import Quest from "../models/Quest.js";
import Rooms from "../models/Rooms.js";
import mongoose from "mongoose";

export default function createHabitsRouter(requireAuth) {
  const router = express.Router();

  const getStartOfDayLocal = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  /**
   * Calculates the daily status and value for a given habit on a specific target date
   * @param {Object} habit - The habit document.
   * @param {Date} targetDate - The date for which to calculate the status.
   * @returns {{status: string, value: number}} An object with the daily status and numeric value.
   */
  const getHabitDailyStatus = (habit, targetDate) => {
    const targetDayStart = getStartOfDayLocal(targetDate);

    const entryForTargetDate = habit.dailyStatuses.find(
      (entry) =>
        getStartOfDayLocal(entry.date).getTime() === targetDayStart.getTime()
    );

    if (entryForTargetDate) {
      return {
        status: entryForTargetDate.status,
        value: entryForTargetDate.value,
      };
    } else {
      // If no entry exists, the habit is implicitly "incomplete" for this day with 0 progress.
      return { status: "incomplete", value: 0 };
    }
  };

  /**
   * Calculates the current streak for a habit based on its dailyStatuses.
   * A streak is defined as consecutive "complete" days where the habit was scheduled.
   * @param {Object} habit - The habit document.
   * @returns {number} The current streak length.
   */
  const calculateStreak = (habit) => {
    let streak = 0;
    const sortedStatuses = [...habit.dailyStatuses].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const now = new Date();

    // start checking from the current day backwards
    let currentDay = getStartOfDayLocal(now);
    for (let i = 0; i < 365 * 100; i++) {
      const dateToCheck = new Date(currentDay);
      dateToCheck.setDate(currentDay.getDate() - i);
      const dayOfWeekToCheck = dateToCheck.toLocaleString("en-US", {
        weekday: "long",
      });
      const dayStartToCheck = getStartOfDayLocal(dateToCheck);

      // If we go before habit's creation date, then we should stop
      if (
        habit.createdAt &&
        dayStartToCheck.getTime() <
          getStartOfDayLocal(habit.createdAt).getTime()
      ) {
        break;
      }

      const isScheduled = habit.days.includes(dayOfWeekToCheck);

      // Find the status entry for this specific day
      const statusEntry = sortedStatuses.find(
        (entry) =>
          getStartOfDayLocal(entry.date).getTime() === dayStartToCheck.getTime()
      );

      if (isScheduled) {
        if (statusEntry && statusEntry.status === "complete") {
          streak++;
        } else if (statusEntry && statusEntry.status === "skipped") {
          continue;
        } else if (statusEntry && statusEntry.status === "incomplete") {
          // if incomplete but it's today, then just continue
          if (dayStartToCheck.getTime() === currentDay.getTime()) {
            continue;
          } else {
            // if it's incomplete from a previous day, then streak is broken
            break;
          }
        } else {
          break;
        }
      }
      // If not scheduled, continue to next previous day
    }
    return streak;
  };

  // GET all habits for the authenticated user for a specific date (or today by default)
  router.get("/", requireAuth, async (req, res) => {
    const user_id = req.userId;
    let targetDate = new Date(); // Default to today
    if (req.query.date) {
      const parsedDate = new Date(req.query.date);
      if (isNaN(parsedDate.getTime())) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid date format provided." });
      }
      targetDate = parsedDate;
    }

    const targetDayOfWeek = targetDate.toLocaleString("en-US", {
      weekday: "long",
    });

    try {
      const habits = await Habit.find({
        userId: user_id,
        days: { $in: [targetDayOfWeek] }, // Filter by scheduled day
      }).lean();

      const habitsWithDayStatus = habits.map((habit) => {
        const dailyStatus = getHabitDailyStatus(habit, targetDate);
        const streak = habit.currentStreak;

        const { dailyStatuses, ...habitWithoutDailyStatuses } = habit;

        return {
          ...habitWithoutDailyStatuses,
          progress: dailyStatus,
          currentStreak: streak,
        };
      });

      res.status(StatusCodes.OK).json(habitsWithDayStatus);
    } catch (err) {
      console.error("Error retrieving habits:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error retrieving habits" });
    }
  });

  // GET all habits for the authenticated user
  router.get("/all", requireAuth, async (req, res) => {
    const user_id = req.userId;

    try {
      const habits = await Habit.find(
        {
          userId: user_id,
        },
        {
          dailyStatuses: 0,
        }
      ).lean();

      res.status(StatusCodes.OK).json(habits);
    } catch (err) {
      console.error("Error retrieving habits:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error retrieving habits" });
    }
  });

  // CREATE a new habit for the user
  router.post("/", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const {
      title,
      description,
      days,
      priority,
      type,
      hours,
      minutes,
      checkmarks,
    } = req.body;

    if (
      !title ||
      !days ||
      !Array.isArray(days) ||
      days.length === 0 ||
      !priority ||
      !type
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing required habit fields." });
    }

    if (!["timed", "checkmark"].includes(type)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid habit type." });
    }

    if (
      type === "timed" &&
      (hours === null || minutes === null || (hours === 0 && minutes === 0))
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Hours and minutes are required for timed habits and can't both be 0.",
      });
    }
    if (type === "checkmark" && (checkmarks === null || checkmarks < 1)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Checkmarks count is required for checkmark habits and can't be less than 1.",
      });
    }

    try {
      const newHabit = new Habit({
        userId: user_id,
        title,
        description,
        days,
        priority,
        type,
        hours: type === "timed" ? hours : null,
        minutes: type === "timed" ? minutes : null,
        checkmarks: type === "checkmark" ? checkmarks : null,
        currentStreak: 0,
        lastStreakUpdateDate: new Date(),
      });

      await newHabit.save();

      const createdHabit = newHabit.toObject();
      const { dailyStatuses, ...habitWithoutDailyStatuses } = createdHabit;

      res.status(StatusCodes.CREATED).json({
        ...habitWithoutDailyStatuses,
        progress: { status: "incomplete", value: 0 },
        currentStreak: 0,
      });
    } catch (err) {
      console.error("Error creating habit:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error creating habit" });
    }
  });

  // UPDATE an existing habit
  router.put("/:id", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const habit_id = req.params.id;
    const {
      title,
      description,
      days,
      priority,
      type,
      hours,
      minutes,
      checkmarks,
    } = req.body;

    if (
      !title ||
      !days ||
      !Array.isArray(days) ||
      days.length === 0 ||
      !priority ||
      !type
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing required habit fields." });
    }

    if (!["timed", "checkmark"].includes(type)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid habit type." });
    }

    if (
      type === "timed" &&
      (hours === null || minutes === null || (hours === 0 && minutes === 0))
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Hours and minutes are required for timed habits and can't both be 0.",
      });
    }
    if (type === "checkmark" && checkmarks === null && checkmarks < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Checkmarks count is required for checkmark habits and can't be less than 1.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(habit_id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid habit ID." });
    }

    try {
      const habit = await Habit.findOne({ _id: habit_id, userId: user_id });

      if (!habit) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Habit not found or not authorized." });
      }

      // Update habit properties
      habit.title = title !== undefined ? title : habit.title;
      habit.description =
        description !== undefined ? description : habit.description;
      habit.days = days !== undefined ? days : habit.days;
      habit.priority = priority !== undefined ? priority : habit.priority;
      habit.type = type !== undefined ? type : habit.type;

      if (habit.type === "timed") {
        habit.hours = hours !== undefined ? hours : habit.hours;
        habit.minutes = minutes !== undefined ? minutes : habit.minutes;
        habit.checkmarks = null;
      } else if (habit.type === "checkmark") {
        habit.checkmarks =
          checkmarks !== undefined ? checkmarks : habit.checkmarks;
        habit.hours = null;
        habit.minutes = null;
      }

      habit.currentStreak = calculateStreak(habit);
      habit.lastStreakUpdateDate = new Date();

      await habit.save();

      const updatedHabit = habit.toObject();
      const { dailyStatuses, ...habitWithoutDailyStatuses } = updatedHabit;

      const now = new Date();
      res.status(StatusCodes.OK).json({
        ...habitWithoutDailyStatuses,
        progress: getHabitDailyStatus(updatedHabit, now),
        currentStreak: updatedHabit.currentStreak,
      });
    } catch (err) {
      console.error("Error updating habit:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error updating habit" });
    }
  });

  // DELETE an existing habit
  router.delete("/:id", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const habit_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(habit_id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid habit ID format." });
    }

    try {
      const deletedHabit = await Habit.findOneAndDelete({
        _id: habit_id,
        userId: user_id,
      });

      if (!deletedHabit) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Habit not found or not authorized to delete." });
      }

      res.status(StatusCodes.OK).json({
        message: "Habit deleted successfully.",
        deletedId: habit_id,
      });
    } catch (err) {
      console.error("Error deleting habit:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error deleting habit." });
    }
  });

  router.post("/:id/complete", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const habit_id = req.params.id;
    const { value } = req.body;

    if (!mongoose.Types.ObjectId.isValid(habit_id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid habit ID." });
    }
    if (typeof value !== "number") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Completion value must be a number." });
    }

    try {
      const habit = await Habit.findOne({ _id: habit_id, userId: user_id });

      if (!habit) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Habit not found or not authorized." });
      }

      const now = new Date();
      const todayStart = getStartOfDayLocal(now);
      let entryIndex = -1;

      // Find existing entry for today
      for (let i = habit.dailyStatuses.length - 1; i >= 0; i--) {
        const entryDateLocal = getStartOfDayLocal(habit.dailyStatuses[i].date);
        if (entryDateLocal.getTime() === todayStart.getTime()) {
          entryIndex = i;
          break;
        }
      }

      let currentStatus;
      let currentProgressValue;

      if (entryIndex !== -1) {
        // Update existing entry: add value, update timestamp
        habit.dailyStatuses[entryIndex].value += value;

        // make sure you don't go under 0
        if (habit.dailyStatuses[entryIndex].value < 0) {
          habit.dailyStatuses[entryIndex].value = 0;
        }

      } else {
        // Create new entry
        let new_value = value >= 0 ? value : 0;
        currentProgressValue = new_value;
        habit.dailyStatuses.push({
          date: now,
          status: "incomplete", // Set as incomplete for now, update to completed if criteria met
          value: currentProgressValue,
          dayOfWeek: now.toLocaleString("en-US", {
            weekday: "long",
          }),
          month: now.toLocaleString("en-US", {
            month: "numeric",
          }),
          year: now.toLocaleString("en-US", {
            year: "numeric",
          }),
        });
        entryIndex = habit.dailyStatuses.length - 1; // Get index of newly pushed entry
      }

        let cur_value = habit.dailyStatuses[entryIndex].value;
        // don't go over completed
        if (
          habit.type === "timed" &&
          habit.hours !== null &&
          habit.minutes !== null
        ) {
          const goalInMinutes = habit.hours * 60 + habit.minutes;
          cur_value = cur_value >= goalInMinutes ? goalInMinutes : cur_value;
        } else if (habit.type === "checkmark" && habit.checkmarks !== null) {
          cur_value =
            cur_value >= habit.checkmarks ? habit.checkmarks : cur_value;
        }

        habit.dailyStatuses[entryIndex].value = cur_value;

        habit.dailyStatuses[entryIndex].date = now;
        currentProgressValue = habit.dailyStatuses[entryIndex].value;

      // Determine the status (complete or incomplete) based on goal completion
      if (
        habit.type === "timed" &&
        habit.hours !== null &&
        habit.minutes !== null
      ) {
        const goalInMinutes = habit.hours * 60 + habit.minutes;
        currentStatus =
          currentProgressValue >= goalInMinutes ? "complete" : "incomplete";
      } else if (habit.type === "checkmark" && habit.checkmarks !== null) {
        currentStatus =
          currentProgressValue >= habit.checkmarks ? "complete" : "incomplete";
      } else {
        // Fallback for habits without explicit goals (might change to raise error in the future)
        currentStatus = "complete";
      }
      habit.dailyStatuses[entryIndex].status = currentStatus;

      habit.currentStreak = calculateStreak(habit);

      // Find daily quest set associated with user
      let dailyQuestSet = await DailyQuestSet.findOne({
        userId: user_id,
        date: getStartOfDayLocal(new Date()),
      }).populate({
        path: "quests.questId",
        model: "Quest",
      });

      let room = null;
      if (dailyQuestSet) {
        room = await Rooms.findOne({ userId: user_id });

        dailyQuestSet.quests.forEach((dailyQ) => {
          const questTemplate = dailyQ.questId;

          // Only update if questTemplate exists and the quest is not already complete
          if (questTemplate && !dailyQ.isComplete) {
            // Capture the completion state before the progress update
            const wasCompleteBefore =
              dailyQ.progress >= questTemplate.targetValue;

            // Logic for quests tied to certain task type (e.g., timed, checkmark)
            if (questTemplate.relatedHabitType === habit.type) {
              dailyQ.progress += value;
            }
            // Logic for quests tied to completion count
            else if (
              questTemplate.relatedHabitType === "any_completion" &&
              habit.dailyStatuses[entryIndex].status === "complete"
            ) {
              dailyQ.progress += 1;
            }

            // Change status of individual quest if it was just completed
            if (
              dailyQ.progress >= questTemplate.targetValue &&
              !wasCompleteBefore
            ) {
              dailyQ.isComplete = true;

              // Award coins for individual quest
              if (room) {
                room.coins += questTemplate.reward;
                console.log(
                  `Awarded ${questTemplate.reward} coins for completing quest: ${questTemplate.name}`
                );
              }
            }
          }
        });

        // Change set status if all quests in the set are now complete
        // NOTE: The bonus reward is NOT awarded here. It is handled by the "Claim Bonus" endpoint.
        const allQuestsDone = dailyQuestSet.quests.every((q) => q.isComplete);
        if (allQuestsDone && !dailyQuestSet.isComplete) {
          dailyQuestSet.isComplete = true;
        }

        await dailyQuestSet.save();
      }

      await habit.save();

      if (room) {
        await room.save();
      }

      const updatedHabit = habit.toObject();
      const { dailyStatuses, ...habitWithoutDailyStatuses } = updatedHabit;

      res.status(StatusCodes.OK).json({
        ...habitWithoutDailyStatuses,
        progress: getHabitDailyStatus(updatedHabit, now),
        currentStreak: updatedHabit.currentStreak,
        dailyQuestSet: dailyQuestSet ? dailyQuestSet.toObject() : null,
      });
    } catch (err) {
      console.error("Error completing habit:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error completing habit" });
    }
  });

  // MARK a habit as skipped
  router.post("/:id/skip", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const habit_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(habit_id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid habit ID." });
    }

    try {
      const habit = await Habit.findOne({ _id: habit_id, userId: user_id });

      if (!habit) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Habit not found or not authorized." });
      }

      const now = new Date();
      const todayStart = getStartOfDayLocal(now);
      let entryIndex = -1;

      for (let i = habit.dailyStatuses.length - 1; i >= 0; i--) {
        const entryDateLocal = getStartOfDayLocal(habit.dailyStatuses[i].date);
        if (entryDateLocal.getTime() === todayStart.getTime()) {
          entryIndex = i;
          break;
        }
      }

      if (entryIndex !== -1) {
        habit.dailyStatuses[entryIndex].status = "skipped";
        habit.dailyStatuses[entryIndex].date = now;
      } else {
        // Create new entry: status "skipped", value 0 (as no prior progress for this day)
        habit.dailyStatuses.push({
          date: now,
          status: "skipped",
          value: 0, // No progress if marked skipped directly without prior action
          dayOfWeek: now.toLocaleString("en-US", {
            weekday: "long",
          }),
          month: now.toLocaleString("en-US", {
            month: "numeric",
          }),
          year: now.toLocaleString("en-US", {
            year: "numeric",
          }),
        });
      }

      habit.currentStreak = calculateStreak(habit);

      await habit.save();

      const updatedHabit = habit.toObject();
      const { dailyStatuses, ...habitWithoutDailyStatuses } = updatedHabit;

      res.status(StatusCodes.OK).json({
        ...habitWithoutDailyStatuses,
        progress: getHabitDailyStatus(updatedHabit, now),
        currentStreak: updatedHabit.currentStreak,
      });
    } catch (err) {
      console.error("Error skipping habit:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error skipping habit" });
    }
  });

  // MARK a habit as failed
  router.post("/:id/fail", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const habit_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(habit_id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid habit ID." });
    }

    try {
      const habit = await Habit.findOne({ _id: habit_id, userId: user_id });

      if (!habit) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Habit not found or not authorized." });
      }

      const now = new Date();
      const todayStart = getStartOfDayLocal(now);
      let entryIndex = -1;

      for (let i = habit.dailyStatuses.length - 1; i >= 0; i--) {
        const entryDateLocal = getStartOfDayLocal(habit.dailyStatuses[i].date);
        if (entryDateLocal.getTime() === todayStart.getTime()) {
          entryIndex = i;
          break;
        }
      }

      if (entryIndex !== -1) {
        habit.dailyStatuses[entryIndex].status = "failed";
        habit.dailyStatuses[entryIndex].date = now;
      } else {
        habit.dailyStatuses.push({
          date: now,
          status: "failed",
          value: 0,
          dayOfWeek: now.toLocaleString("en-US", {
            weekday: "long",
          }),
          month: now.toLocaleString("en-US", {
            month: "numeric",
          }),
          year: now.toLocaleString("en-US", {
            year: "numeric",
          }),
        });
      }

      habit.currentStreak = calculateStreak(habit);

      await habit.save();

      const updatedHabit = habit.toObject();
      const { dailyStatuses, ...habitWithoutDailyStatuses } = updatedHabit;

      res.status(StatusCodes.OK).json({
        ...habitWithoutDailyStatuses,
        progress: getHabitDailyStatus(updatedHabit, now),
        currentStreak: updatedHabit.currentStreak,
      });
    } catch (err) {
      console.error("Error failing habit:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error failing habit" });
    }
  });

  router.get("/:id/stats", requireAuth, async (req, res) => {
    const user_id = req.userId;
    const habit_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(habit_id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid habit ID." });
    }

    try {
      const habit = await Habit.findOne({
        _id: habit_id,
        userId: user_id,
      }).select("currentStreak dailyStatuses type title");

      if (!habit) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Habit not found or not authorized." });
      }

      let completedDays = 0;
      let failedDays = 0;
      let skippedDays = 0;
      let totalValue = 0;

      // --- Calculate current week boundaries (Sunday to Saturday) ---
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - now.getDay()); // Get Sunday (0) of current week
      currentWeekStart.setHours(0, 0, 0, 0); // Ensure beginning of the day

      const currentWeekEnd = new Date(now);
      currentWeekEnd.setDate(now.getDate() + (6 - now.getDay())); // Get Saturday (6) of current week
      currentWeekEnd.setHours(23, 59, 59, 999); // Ensure end of the day
      // --- End current week calculations ---

      // Initialize array for daily values of the current week (Sunday to Saturday)
      // Each element starts as null, as requested for days that don't exist yet.
      const totalValuePerDayCurrentWeek = new Array(7).fill(0);

      if (habit.dailyStatuses && habit.dailyStatuses.length > 0) {
        habit.dailyStatuses.forEach((entry) => {
          const entryDate = new Date(entry.date);
          const entryDateOnly = new Date(entryDate);
          entryDateOnly.setHours(0, 0, 0, 0); // Normalize entry date to start of day for comparison

          switch (entry.status) {
            case "complete":
              completedDays++;
              break;
            case "failed":
              failedDays++;
              break;
            case "skipped":
              skippedDays++;
              break;
          }
          totalValue += entry.value || 0;

          if (
            entryDateOnly >= currentWeekStart &&
            entryDateOnly <= currentWeekEnd
          ) {
            const dayOfWeek = entryDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

            if (totalValuePerDayCurrentWeek[dayOfWeek] === null) {
              totalValuePerDayCurrentWeek[dayOfWeek] = 0;
            }
            totalValuePerDayCurrentWeek[dayOfWeek] += entry.value || 0;
          }
        });
      }

      const habitStats = {
        title: habit.title,
        currentStreak: habit.currentStreak || 0,
        completedDays: completedDays,
        failedDays: failedDays,
        skippedDays: skippedDays,
        type: habit.type,
        totalValue: totalValue,
        totalValuePerDayCurrentWeek: totalValuePerDayCurrentWeek,
      };

      res.status(StatusCodes.OK).json(habitStats);
    } catch (err) {
      console.error("Error retrieving habit statistics:", err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error retrieving habit statistics" });
    }
  });

  return router;
}
