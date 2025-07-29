import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  startTimer,
  stopTimer,
  setTimer,
  tick,
} from '../features/timerSlice';
import { updateProgress } from '../features/tasksSlice';
import { addCoinsAndUpdate } from '../features/inventorySlice';

import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const TimerDisplay = ({ onHabitComplete, onDeselectTask, onSecondsCounterChange }) => {
  const dispatch = useDispatch();
  const timeLeft = useSelector((state) => state.timer.timeLeft);
  const isRunning = useSelector((state) => state.timer.isRunning);
  const selectedTaskId = useSelector((state) => state.tasks.selectedTaskId);
  const allTasks = useSelector((state) => state.tasks.taskList);

  const TIMED_HABIT_COMPLETION_REWARD = 5;

  const [inputMinutes, setInputMinutes] = useState("");
  const [inputSeconds, setInputSeconds] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [secondsCounter, setSecondsCounter] = useState(0); // Counter for seconds elapsed on current habit

  const isInitialMount = useRef(true);
  const previousSelectedTaskId = useRef(selectedTaskId);

  // Function to check if habit is complete after progress update
  const checkHabitCompletion = useCallback((taskId) => {
    if (taskId && taskId !== -1) {
      const selectedTask = allTasks.find(task => task._id === taskId && task.type === "timed");
      if (selectedTask) {
        const goalInMinutes = (selectedTask.hours || 0) * 60 + (selectedTask.minutes || 0);
        const currentProgress = selectedTask.progress?.value + 1 || 0;
        
        // Check if the habit is now complete
        if (currentProgress >= goalInMinutes && selectedTask.progress?.status !== 'complete') {
          // Stop the timer
          dispatch(stopTimer());
          
          // Add coins for completing the habit
          dispatch(addCoinsAndUpdate(TIMED_HABIT_COMPLETION_REWARD));
          
          // Notify parent component about completion
          if (onHabitComplete) {
            onHabitComplete(selectedTask.title);
          }
          
          return true; // Habit was completed
        }
      }
    }
    return false; // Habit not completed
  }, [allTasks, dispatch, onHabitComplete]);

  // Sync local input states with Redux timeLeft when timeLeft changes
  useEffect(() => {
    if (focusedInput === null || isInitialMount.current) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      setInputMinutes(minutes === 0 && !isRunning && timeLeft === 0 ? "" : String(minutes));
      setInputSeconds(seconds === 0 && !isRunning && timeLeft === 0 ? "" : String(seconds));
    }
    isInitialMount.current = false;
  }, [timeLeft, isRunning, focusedInput]);

  // Reset seconds counter when selected task changes
  useEffect(() => {
    if (previousSelectedTaskId.current !== selectedTaskId) {
      setSecondsCounter(0);
      previousSelectedTaskId.current = selectedTaskId;
    }
  }, [selectedTaskId]);

  // Notify parent of seconds counter changes
  useEffect(() => {
    if (onSecondsCounterChange) {
      onSecondsCounterChange(secondsCounter);
    }
  }, [secondsCounter, onSecondsCounterChange]);

  // Effect for timer ticking and habit progress tracking
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        dispatch(tick());
        
        // Increment seconds counter for habit progress tracking
        if (selectedTaskId && selectedTaskId !== -1) {
          setSecondsCounter(prev => {
            const newCounter = prev + 1;
            
            // Update progress every 60 seconds (1 minute)
            if (newCounter >= 60) {
              dispatch(updateProgress({ taskId: selectedTaskId, value: 1 }));
              checkHabitCompletion(selectedTaskId);
              return 0; // Reset counter after updating progress
            }
            
            return newCounter;
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isRunning) {
      dispatch(stopTimer());
      
    }
  }, [isRunning, timeLeft, dispatch, selectedTaskId, secondsCounter, checkHabitCompletion]);

  const calculateTotalSeconds = useCallback(() => {
    return (
      parseInt(inputMinutes || "0", 10) * 60 +
      parseInt(inputSeconds || "0", 10)
    );
  }, [inputMinutes, inputSeconds]);

  const handleSetTimer = useCallback(() => {
    const totalSeconds = calculateTotalSeconds();
    if (totalSeconds >= 0) {
      dispatch(setTimer(totalSeconds));
    }
  }, [calculateTotalSeconds, dispatch]);

  const handleToggleTimer = useCallback(() => {
    if (isRunning) {
      dispatch(stopTimer());
    } else {
      const totalSeconds = calculateTotalSeconds();
      if (totalSeconds > 0) {
        dispatch(setTimer(totalSeconds));
        dispatch(startTimer());
      }
    }
  }, [isRunning, calculateTotalSeconds, dispatch]);

  const handleResetTimer = useCallback(() => {
    dispatch(stopTimer());
    dispatch(setTimer(0));
    setInputMinutes("");
    setInputSeconds("");
  }, [dispatch]);

  const handleNumericInputChange =
    (setter) =>
    (event) => {
      const value = event.target.value;
      if (value === "" || /^\d+$/.test(value)) {
        if (value.length <= 2) {
          setter(value);
        }
      }
    };

  const handleInputBlur = useCallback((setter, maxVal, inputId) => (event) => {
    const value = event.target.value;
    let numValue = parseInt(value, 10);

    if (isNaN(numValue) || value === "") {
      numValue = 0;
    }
    if (maxVal && numValue > maxVal) {
      numValue = maxVal;
    }
    if (numValue < 0) {
      numValue = 0;
    }

    if (String(numValue) !== value) {
      setter(String(numValue));
    }

    handleSetTimer();
    setFocusedInput(null);
  }, [handleSetTimer]);

  const getDisplayValue = (value, inputId) => {
    if (focusedInput === inputId || value === "") {
      return value;
    }
    return String(parseInt(value, 10)).padStart(2, "0");
  };

  // Get selected task for display
  const selectedTask = useSelector((state) => {
    if (selectedTaskId && selectedTaskId !== -1) {
      return state.tasks.taskList.find(task => task._id === selectedTaskId);
    }
    return null;
  });

  // Calculate progress percentage for the progress circle
  const getProgressPercentage = () => {
    if (!selectedTask) return 0;
    const goalInMinutes = (selectedTask.hours || 0) * 60 + (selectedTask.minutes || 0);
    const currentProgress = selectedTask.progress?.value || 0;
    return goalInMinutes > 0 ? Math.min((currentProgress / goalInMinutes) * 100, 100) : 0;
  };

  const progressPercentage = getProgressPercentage();
  const radius = 185;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <>
      <Box
        sx={{
          p: 2,
          bgcolor: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 2,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {selectedTask ? (
          <>
            <Typography variant="h6" sx={{ color: 'white', mb: 1}}>
              {selectedTask.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
              Goal: {selectedTask.hours}h {selectedTask.minutes}m | 
              Progress: {Math.floor((selectedTask.progress?.value || 0) / 60)}h {(selectedTask.progress?.value || 0) % 60}m
            </Typography>
            <Button
              onClick={() => onDeselectTask && onDeselectTask()}
              sx={{
                minWidth: 'auto',
                width: 24,
                height: 24,
                borderRadius: '50%',
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.1)',
                  color: 'white',
                },
              }}
            >
              ✕
            </Button>
          </>
        ) : (
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Select a timed habit to track your progress
          </Typography>
        )}
      </Box>
      
      <Box
        sx={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          mt: 4,
        }}
      >
        {/* Progress Circle */}
        <svg
          width="400"
          height="400"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
            pointerEvents: 'none',
          }}
        >
          {/* Background circle */}
          <circle
            cx="200"
            cy="200"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="200"
            cy="200"
            r={radius}
            stroke="#4ade80"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
              filter: 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.5))', // Glow effect
            }}
          />
        </svg>
        
        <Box
          sx={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            gap: 0.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <TextField
            variant="standard"
            value={getDisplayValue(inputMinutes, "minutes")}
            onChange={handleNumericInputChange(setInputMinutes)}
            onFocus={() => setFocusedInput("minutes")}
            onBlur={handleInputBlur(setInputMinutes, 59, "minutes")}
            onKeyPress={(e) => { if (e.key === "Enter") e.target.blur(); }}
            placeholder="00"
            disabled={isRunning}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
              max: 59,
              maxLength: 2,
              style: {
                textAlign: "center",
                fontSize: "6rem",
                fontWeight: "bold",
                color: 'white',
                WebkitTextFillColor: 'white !important',
                opacity: 1,
              },
            }}
            sx={{
              "& .MuiInput-underline:before": { borderBottom: "none" },
              "& .MuiInput-underline:after": { borderBottom: "none" },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
              "& .MuiInputBase-input.Mui-disabled": {
                  color: 'white !important',
                  WebkitTextFillColor: 'white !important',
                  opacity: 1,
              },
              width: 150,
            }}
          />
          <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'white' }}>
            :
          </Typography>
          <TextField
            variant="standard"
            value={getDisplayValue(inputSeconds, "seconds")}
            onChange={handleNumericInputChange(setInputSeconds)}
            onFocus={() => setFocusedInput("seconds")}
            onBlur={handleInputBlur(setInputSeconds, 59, "seconds")}
            onKeyPress={(e) => { if (e.key === "Enter") e.target.blur(); }}
            placeholder="00"
            disabled={isRunning}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
              max: 59,
              maxLength: 2,
              style: {
                textAlign: "center",
                fontSize: "6rem",
                fontWeight: "bold",
                color: 'white',
                WebkitTextFillColor: 'white !important',
                opacity: 1,
              },
            }}
            sx={{
              "& .MuiInput-underline:before": { borderBottom: "none" },
              "& .MuiInput-underline:after": { borderBottom: "none" },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
              "& .MuiInputBase-input.Mui-disabled": {
                  color: 'white !important',
                  WebkitTextFillColor: 'white !important',
                  opacity: 1,
              },
              width: 150,
            }}
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
        onClick={handleToggleTimer}
        sx={{
          mt: 4,
          bgcolor: 'white',
          color: 'black',
          borderRadius: 8,
          px: 4,
          py: 1.5,
          textTransform: 'none',
          '&:hover': {
            bgcolor: 'grey.200',
          },
          disabled: calculateTotalSeconds() === 0 && !isRunning
        }}
      >
        {isRunning ? 'Pause Focus' : (timeLeft === 0 && calculateTotalSeconds() === 0 ? 'Set Time & Start' : 'Start Focus')}
      </Button>

      {(timeLeft > 0 || calculateTotalSeconds() > 0) && (
          <Button
              onClick={handleResetTimer}
              sx={{
                  mt: 2,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  textTransform: 'none',
              }}
              variant="outlined"
              disabled={isRunning}
          >
              Reset Timer
          </Button>
      )}
    </>
  );
};

export default TimerDisplay;