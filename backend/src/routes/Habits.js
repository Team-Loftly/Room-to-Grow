import express from "express";
import StatusCodes from "http-status-codes";
import Habit from "../models/Habit.js";
import DailyQuestSet from "../models/DailyQuestSet.js";
import Quest from "../models/Quest.js";
import Rooms from "../models/Rooms.js";
import mongoose from "mongoose";

export default function createHabitsRouter(requireAuth) {
  const router = express.Router();

  // Constants
  const LOCALE = "en-US";
  const MAX_STREAK_CALCULATION_DAYS = 36500; // 100 years worth of days
  const TASK_COMPLETION_REWARD = 5; // Coins awarded for completing a task
  const HABIT_TYPES = {
    TIMED: "timed",
    CHECKMARK: "checkmark"
  };
  const STATUS_TYPES = {
    COMPLETE: "complete",
    INCOMPLETE: "incomplete",
    SKIPPED: "skipped",
    FAILED: "failed"
  };

  const getStartOfDayLocal = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  /**
   * Validates habit form data
   * @param {Object} formData - The form data to validate
   * @returns {Object} { isValid: boolean, message?: string }
   */
  const validateHabitForm = (formData) => {
    const { title, days, priority, type, hours, minutes, checkmarks } = formData;

    if (!title || !days || !Array.isArray(days) || days.length === 0 || !priority || !type) {
      return { isValid: false, message: "Missing required habit fields." };
    }

    if (!Object.values(HABIT_TYPES).includes(type)) {
      return { isValid: false, message: "Invalid habit type." };
    }

    if (type === HABIT_TYPES.TIMED && (hours === null || minutes === null || (hours === 0 && minutes === 0))) {
      return { 
        isValid: false, 
        message: "Hours and minutes are required for timed habits and can't both be 0." 
      };
    }

    if (type === HABIT_TYPES.CHECKMARK && (checkmarks === null || checkmarks < 1)) {
      return { 
        isValid: false, 
        message: "Checkmarks count is required for checkmark habits and can't be less than 1." 
      };
    }

    return { isValid: true };
  };

  /**
   * Finds or creates a daily status entry for a habit on a specific date
   * @param {Object} habit - The habit document
   * @param {Date} targetDate - The target date
   * @returns {number} Index of the entry in dailyStatuses array
   */
  const findOrCreateDailyStatusEntry = (habit, targetDate) => {
    const targetDayStart = getStartOfDayLocal(targetDate);
    
    // Find existing entry
    for (let i = habit.dailyStatuses.length - 1; i >= 0; i--) {
      const entryDateLocal = getStartOfDayLocal(habit.dailyStatuses[i].date);
      if (entryDateLocal.getTime() === targetDayStart.getTime()) {
        return i;
      }
    }

    // Create new entry if not found
    habit.dailyStatuses.push({
      date: targetDate,
      status: STATUS_TYPES.INCOMPLETE,
      value: 0,
      dayOfWeek: targetDate.toLocaleString(LOCALE, { weekday: "long" }),
      month: targetDate.toLocaleString(LOCALE, { month: "numeric" }),
      year: targetDate.toLocaleString(LOCALE, { year: "numeric" }),
    });

    return habit.dailyStatuses.length - 1;
  };

  /**
   * Updates a daily status entry with new status and optionally value
   * @param {Object} habit - The habit document
   * @param {number} entryIndex - Index of the entry to update
   * @param {Date} targetDate - The target date
   * @param {string} status - New status
   * @param {number} value - New value (optional)
   */
  const updateDailyStatusEntry = (habit, entryIndex, targetDate, status, value = null) => {
    habit.dailyStatuses[entryIndex].status = status;
    habit.dailyStatuses[entryIndex].date = targetDate;
    
    if (value !== null) {
      habit.dailyStatuses[entryIndex].value = value;
    }
  };

  /**
   * Determines if a habit is complete based on its type and progress value
   * @param {Object} habit - The habit document
   * @param {number} progressValue - Current progress value
   * @returns {boolean} Whether the habit is complete
   */
  const isHabitComplete = (habit, progressValue) => {
    if (habit.type === HABIT_TYPES.TIMED && habit.hours !== null && habit.minutes !== null) {
      const goalInMinutes = habit.hours * 60 + habit.minutes;
      return progressValue >= goalInMinutes;
    } else if (habit.type === HABIT_TYPES.CHECKMARK && habit.checkmarks !== null) {
      return progressValue >= habit.checkmarks;
    }
    return true;
  };

  /**
   * Clamps progress value to not exceed habit goals
   * @param {Object} habit - The habit document  
   * @param {number} value - Current progress value
   * @returns {number} Clamped value
   */
  const clampProgressValue = (habit, value) => {
    if (habit.type === HABIT_TYPES.TIMED && habit.hours !== null && habit.minutes !== null) {
      const goalInMinutes = habit.hours * 60 + habit.minutes;
      return Math.min(value, goalInMinutes);
    } else if (habit.type === HABIT_TYPES.CHECKMARK && habit.checkmarks !== null) {
      return Math.min(value, habit.checkmarks);
    }
    return value;
  };

  /**
   * Builds a standardized habit response object
   * @param {Object} habit - The habit document
   * @param {Date} targetDate - Date for progress calculation
   * @param {Object} additionalData - Additional data to include (optional)
   * @returns {Object} Formatted response object
   */
  const buildHabitResponse = (habit, targetDate, additionalData = {}) => {
    const habitObj = habit.toObject ? habit.toObject() : habit;
    const { dailyStatuses, ...habitWithoutDailyStatuses } = habitObj;

    return {
      ...habitWithoutDailyStatuses,
      progress: getHabitDailyStatus(habitObj, targetDate),
      currentStreak: habitObj.currentStreak,
      ...additionalData
    };
  };

  /**
   * Parse date parameter safely, handling both YYYY-MM-DD strings and Date objects
   * @param {string|Date} dateParam - The date parameter to parse
   * @returns {Date} Parsed date object
   * @throws {Error} If date format is invalid
   */
  const parseDate = (dateParam) => {
    if (!dateParam) {
      return new Date();
    }

    // Handle YYYY-MM-DD format specifically to avoid timezone issues
    if (typeof dateParam === 'string' && dateParam.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = dateParam.split('-');
      return new Date(parts[0], parts[1] - 1, parts[2]); // Year, Month (0-indexed), Day
    }

    const parsedDate = new Date(dateParam);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format provided.");
    }
    
    return parsedDate;
  };

  /**
   * Updates quest progress when a habit is completed
   * @param {string} userId - User ID
   * @param {Object} habit - Habit object
   * @param {number} value - Progress value added
   * @param {boolean} isComplete - Whether the habit was completed
   * @returns {Promise<{dailyQuestSet: Object|null, coins: number|undefined}>}
   */
  const updateQuestProgress = async (userId, habit, value, isComplete) => {
    try {
      let dailyQuestSet = await DailyQuestSet.findOne({
        userId: userId,
        date: getStartOfDayLocal(new Date()),
      }).populate({
        path: "quests.questId",
        model: "Quest",
      });

      let room = null;
      if (dailyQuestSet) {
        room = await Rooms.findOne({ userId: userId });

        dailyQuestSet.quests.forEach((dailyQ) => {
          const questTemplate = dailyQ.questId;

          // Only update if questTemplate exists and the quest is not already complete
          if (questTemplate && !dailyQ.isComplete) {
            // Capture the completion state before the progress update
            const wasCompleteBefore = dailyQ.progress >= questTemplate.targetValue;

            // Logic for quests tied to certain task type (e.g., timed, checkmark)
            if (questTemplate.relatedHabitType === habit.type) {
              dailyQ.progress += value;
            }
            // Logic for quests tied to completion count
            else if (questTemplate.relatedHabitType === "any_completion" && isComplete) {
              dailyQ.progress += 1;
            }

            // Change status of individual quest if it was just completed
            if (dailyQ.progress >= questTemplate.targetValue && !wasCompleteBefore) {
              dailyQ.isComplete = true;

              // Award coins for individual quest
              if (room) {
                room.coins += questTemplate.reward;
              }
            }
          }
        });

        const allQuestsDone = dailyQuestSet.quests.every((q) => q.isComplete);
        if (allQuestsDone && !dailyQuestSet.isComplete) {
          dailyQuestSet.isComplete = true;
        }

        await dailyQuestSet.save();
      }

      if (room) {
        await room.save();
      }

      return {
        dailyQuestSet: dailyQuestSet ? dailyQuestSet.toObject() : null,
        coins: room ? room.coins : undefined,
      };
    } catch (error) {
      console.error("Error updating quest progress:", error);
      return { dailyQuestSet: null, coins: undefined };
    }
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
    for (let i = 0; i < MAX_STREAK_CALCULATION_DAYS; i++) {
      const dateToCheck = new Date(currentDay);
      dateToCheck.setDate(currentDay.getDate() - i);
      const dayOfWeekToCheck = dateToCheck.toLocaleString(LOCALE, {
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
    
    try {
      const targetDate = parseDate(req.query.date);
      const targetDayOfWeek = targetDate.toLocaleString(LOCALE, {
        weekday: "long",
      });

      const habits = await Habit.find({
        userId: user_id,
        days: { $in: [targetDayOfWeek] }, // Filter by scheduled day
      }).lean();

      const habitsWithDayStatus = [];
      let hasStreakUpdates = false;

      for (const habit of habits) {
        // Only recalculate streak if it hasn't been updated today
        const today = getStartOfDayLocal(new Date());
        const lastUpdate = habit.lastStreakUpdateDate ? getStartOfDayLocal(habit.lastStreakUpdateDate) : null;
        
        let currentStreak = habit.currentStreak;
        
        // Recalculate streak if it hasn't been updated today or if lastStreakUpdateDate is missing
        if (!lastUpdate || lastUpdate.getTime() < today.getTime()) {
          const recalculatedStreak = calculateStreak(habit);
          
          // Only update the database if the streak has changed
          if (habit.currentStreak !== recalculatedStreak) {
            habit.currentStreak = recalculatedStreak;
            habit.lastStreakUpdateDate = new Date();
            habit._needsStreakUpdate = true;
            hasStreakUpdates = true;
          }
          
          currentStreak = recalculatedStreak;
        }

        const dailyStatus = getHabitDailyStatus(habit, targetDate);
        const { dailyStatuses, ...habitWithoutDailyStatuses } = habit;

        habitsWithDayStatus.push({
          ...habitWithoutDailyStatuses,
          progress: dailyStatus,
          currentStreak: currentStreak,
        });
      }

      // Bulk save all habits with updated streaks
      if (hasStreakUpdates) {
        await Habit.bulkWrite(
          habits
            .filter(h => h._needsStreakUpdate)
            .map(habit => ({
              updateOne: {
                filter: { _id: habit._id },
                update: { 
                  currentStreak: habit.currentStreak,
                  lastStreakUpdateDate: habit.lastStreakUpdateDate
                }
              }
            }))
        );
      }

      res.status(StatusCodes.OK).json(habitsWithDayStatus);
    } catch (err) {
      if (err.message === "Invalid date format provided.") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: err.message });
      }
      
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
    const formData = req.body;

    const validation = validateHabitForm(formData);
    if (!validation.isValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: validation.message });
    }

    const { title, description, days, priority, type, hours, minutes, checkmarks } = formData;

    try {
      const newHabit = new Habit({
        userId: user_id,
        title,
        description,
        days,
        priority,
        type,
        hours: type === HABIT_TYPES.TIMED ? hours : null,
        minutes: type === HABIT_TYPES.TIMED ? minutes : null,
        checkmarks: type === HABIT_TYPES.CHECKMARK ? checkmarks : null,
        currentStreak: 0,
        lastStreakUpdateDate: new Date(),
      });

      await newHabit.save();

      res.status(StatusCodes.CREATED).json(
        buildHabitResponse(newHabit, new Date(), { 
          progress: { status: STATUS_TYPES.INCOMPLETE, value: 0 },
          currentStreak: 0 
        })
      );
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

    if (!mongoose.Types.ObjectId.isValid(habit_id)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid habit ID." });
    }

    const validation = validateHabitForm(req.body);
    if (!validation.isValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: validation.message });
    }

    const { title, description, days, priority, type, hours, minutes, checkmarks } = req.body;

    try {
      const habit = await Habit.findOne({ _id: habit_id, userId: user_id });

      if (!habit) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Habit not found or not authorized." });
      }

      // Update habit properties
      habit.title = title !== undefined ? title : habit.title;
      habit.description = description !== undefined ? description : habit.description;
      habit.days = days !== undefined ? days : habit.days;
      habit.priority = priority !== undefined ? priority : habit.priority;
      habit.type = type !== undefined ? type : habit.type;

      if (habit.type === HABIT_TYPES.TIMED) {
        habit.hours = hours !== undefined ? hours : habit.hours;
        habit.minutes = minutes !== undefined ? minutes : habit.minutes;
        habit.checkmarks = null;
      } else if (habit.type === HABIT_TYPES.CHECKMARK) {
        habit.checkmarks = checkmarks !== undefined ? checkmarks : habit.checkmarks;
        habit.hours = null;
        habit.minutes = null;
      }

      habit.currentStreak = calculateStreak(habit);
      habit.lastStreakUpdateDate = new Date();

      await habit.save();

      res.status(StatusCodes.OK).json(buildHabitResponse(habit, new Date()));
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

  // MARK a habit as completed/update progress
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

      const targetDate = new Date();
      const entryIndex = findOrCreateDailyStatusEntry(habit, targetDate);

      // Get the previous status to check if this was just completed
      const previousStatus = habit.dailyStatuses[entryIndex]?.status;
      const wasAlreadyComplete = previousStatus === STATUS_TYPES.COMPLETE;

      // Update progress value
      let newValue = Math.max(0, habit.dailyStatuses[entryIndex].value + value);
      newValue = clampProgressValue(habit, newValue);

      // Determine completion status and update entry
      const completionStatus = isHabitComplete(habit, newValue) 
        ? STATUS_TYPES.COMPLETE 
        : STATUS_TYPES.INCOMPLETE;

      updateDailyStatusEntry(habit, entryIndex, targetDate, completionStatus, newValue);

      // Update streak and save
      habit.currentStreak = calculateStreak(habit);

      // Update quest progress
      const questUpdate = await updateQuestProgress(
        user_id, 
        habit, 
        value, 
        completionStatus === STATUS_TYPES.COMPLETE
      );

      // If the task was just completed (not already complete), award completion coins
      if (completionStatus === STATUS_TYPES.COMPLETE && !wasAlreadyComplete) {
        let room = await Rooms.findOne({ userId: user_id });
        if (room) {
          room.coins += TASK_COMPLETION_REWARD;
          await room.save();
          // Update the questUpdate coins to reflect the new total
          questUpdate.coins = room.coins;
        }
      }

      await habit.save();

      res.status(StatusCodes.OK).json(
        buildHabitResponse(habit, new Date(), {
          dailyQuestSet: questUpdate.dailyQuestSet,
          newCoins: questUpdate.coins,
        })
      );
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

      const entryIndex = findOrCreateDailyStatusEntry(habit, new Date());
      updateDailyStatusEntry(habit, entryIndex, new Date(), STATUS_TYPES.SKIPPED, 0);

      habit.currentStreak = calculateStreak(habit);
      await habit.save();

      res.status(StatusCodes.OK).json(buildHabitResponse(habit, new Date()));
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

      const entryIndex = findOrCreateDailyStatusEntry(habit, new Date());
      updateDailyStatusEntry(habit, entryIndex, new Date(), STATUS_TYPES.FAILED, 0);

      habit.currentStreak = calculateStreak(habit);
      await habit.save();

      res.status(StatusCodes.OK).json(buildHabitResponse(habit, new Date()));
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

      const completedDates = [];
      const failedDates = [];
      const skippedDates = [];

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
              completedDates.push(entry.date);
              break;
            case "failed":
              failedDays++;
              failedDates.push(entry.date);
              break;
            case "incomplete":
              failedDays++;
              failedDates.push(entry.date);
              break;
            case "skipped":
              skippedDays++;
              skippedDates.push(entry.date);
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
        dailyStatuses: habit.dailyStatuses || [],
        completedDates: completedDates,
        failedDates: failedDates,
        skippedDates: skippedDates,
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
