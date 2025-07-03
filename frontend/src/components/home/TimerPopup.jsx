import React, { useEffect, useState, useCallback, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import {
  startTimer,
  stopTimer,
  closeTimer,
  setTimer,
  tick,
} from "../../features/timerSlice";
import { Typography, Stack, Box } from "@mui/material";

export default function TimerPopup() {
  const dispatch = useDispatch();
  const timeLeft = useSelector((state) => state.timer.timeLeft);
  const isRunning = useSelector((state) => state.timer.isRunning);
  const showTimer = useSelector((state) => state.timer.showTimer);

  // local state for hour, minute, second input (stored as strings)
  const [inputHours, setInputHours] = useState("");
  const [inputMinutes, setInputMinutes] = useState("");
  const [inputSeconds, setInputSeconds] = useState("");
  const [focusedInput, setFocusedInput] = useState(null); // to track which input is focused

  // prevents premature setting of timer when dialog is initially opening
  const isInitialMount = useRef(true);

  // sync local and Redux states when popup opens or timeLeft changes
  useEffect(() => {
    if (showTimer && isInitialMount.current) {
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      setInputHours(hours === 0 ? "" : String(hours));
      setInputMinutes(minutes === 0 ? "" : String(minutes));
      setInputSeconds(seconds === 0 ? "" : String(seconds));
      isInitialMount.current = false;
    } else if (!showTimer) {
      // reset when dialog closes
      isInitialMount.current = true;
    }
  }, [timeLeft, showTimer]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        dispatch(tick());
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isRunning) {
      dispatch(stopTimer());
      // TODO: add a notification or sound when timer finishes
    }
  }, [isRunning, timeLeft, dispatch]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (hours > 0) {
      parts.push(String(hours).padStart(2, "0"));
    }
    parts.push(String(minutes).padStart(2, "0"));
    parts.push(String(secs).padStart(2, "0"));

    return parts.join(":");
  };

  const handleClose = useCallback(() => {
    dispatch(closeTimer());
    dispatch(stopTimer());
  }, [dispatch]);

  const calculateTotalSeconds = useCallback(() => {
    return (
      parseInt(inputHours || "0", 10) * 3600 +
      parseInt(inputMinutes || "0", 10) * 60 +
      parseInt(inputSeconds || "0", 10)
    );
  }, [inputHours, inputMinutes, inputSeconds]);

  const handleSetTimer = useCallback(() => {
    const totalSeconds = calculateTotalSeconds();
    if (totalSeconds >= 0) {
      dispatch(setTimer(totalSeconds));
    }
  }, [calculateTotalSeconds, dispatch]);

  const handleStart = useCallback(() => {
    if (!isRunning) {
      const totalSeconds = calculateTotalSeconds();
      if (totalSeconds !== timeLeft || timeLeft === 0) {
        dispatch(setTimer(totalSeconds));
      }
      if (totalSeconds > 0) {
        dispatch(startTimer());
      }
    }
  }, [isRunning, timeLeft, calculateTotalSeconds, dispatch]);

  const handleStop = useCallback(() => {
    dispatch(stopTimer());
  }, [dispatch]);

  const handleNumericInputChange =
    (setter, maxValue = Infinity) =>
    (event) => {
      const value = event.target.value;
      // empty string or numbers only
      if (value === "" || /^\d+$/.test(value)) {
        if (value.length <= 2) {
          setter(value);
        }
      }
    };

  const handleInputBlur = (setter, maxVal, inputId) => (event) => {
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

    // update state with cleaned numeric value cast to string
    // update only if value has changed
    if (String(numValue) !== value) {
      setter(String(numValue));
    }

    handleSetTimer();
    setFocusedInput(null);
  };

  const getDisplayValue = (value, inputId) => {
    if (focusedInput === inputId) {
      return value;
    }
    if (value === "") {
      return "";
    }
    return String(parseInt(value, 10)).padStart(2, "0");
  };

  return (
    <Dialog
      open={showTimer}
      onClose={handleClose}
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
      PaperProps={{
        sx: {
          position: "absolute", // Essential for custom positioning
          top: 20, // Distance from the top of the viewport
          right: 20, // Distance from the right of the viewport
          margin: 0, // Remove default dialog margin
          minWidth: 300, // Make it smaller, adjust as needed
          maxWidth: 300, // Make it smaller, adjust as needed
          width: "calc(100% - 40px)", // A bit smaller than full width on very small screens
          borderRadius: 4, // More rounded corners
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)", // Subtle shadow
          backgroundColor: "#f9f9f9", // Light background
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          pb: 1,
          color: "#333", // Darker text for title
          fontWeight: "bold",
        }}
      >
        Set Timer
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 2,
          pb: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 2 }}
        >
          <TextField
            variant="standard" // Minimalistic variant
            value={getDisplayValue(inputHours, "hours")} // Use helper function
            onChange={handleNumericInputChange(setInputHours)}
            onFocus={() => setFocusedInput("hours")}
            onBlur={handleInputBlur(setInputHours, 99, "hours")} // Max 99 hours (arbitrary)
            onKeyPress={(e) => {
              if (e.key === "Enter") e.target.blur();
            }} // Blur on Enter to trigger onBlur
            placeholder="00" // Placeholder for empty state
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
              maxLength: 2,
              style: {
                textAlign: "center",
                fontSize: "2.5rem",
                fontWeight: "600",
                color: "#444",
                padding: "8px 0",
              },
            }}
            sx={{
              "& .MuiInput-underline:before": { borderBottom: "none" },
              "& .MuiInput-underline:after": { borderBottom: "none" },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                borderBottom: "none",
              },
              width: 80,
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#666" }}>
            :
          </Typography>
          <TextField
            variant="standard"
            value={getDisplayValue(inputMinutes, "minutes")} // Use helper function
            onChange={handleNumericInputChange(setInputMinutes, 59)}
            onFocus={() => setFocusedInput("minutes")}
            onBlur={handleInputBlur(setInputMinutes, 59, "minutes")}
            onKeyPress={(e) => {
              if (e.key === "Enter") e.target.blur();
            }}
            placeholder="00"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
              max: 59,
              maxLength: 2,
              style: {
                textAlign: "center",
                fontSize: "2.5rem",
                fontWeight: "600",
                color: "#444",
                padding: "8px 0",
              },
            }}
            sx={{
              "& .MuiInput-underline:before": { borderBottom: "none" },
              "& .MuiInput-underline:after": { borderBottom: "none" },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                borderBottom: "none",
              },
              width: 80,
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#666" }}>
            :
          </Typography>
          <TextField
            variant="standard"
            value={getDisplayValue(inputSeconds, "seconds")} // Use helper function
            onChange={handleNumericInputChange(setInputSeconds, 59)}
            onFocus={() => setFocusedInput("seconds")}
            onBlur={handleInputBlur(setInputSeconds, 59, "seconds")}
            onKeyPress={(e) => {
              if (e.key === "Enter") e.target.blur();
            }}
            placeholder="00"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              min: 0,
              max: 59,
              maxLength: 2,
              style: {
                textAlign: "center",
                fontSize: "2.5rem",
                fontWeight: "600",
                color: "#444",
                padding: "8px 0",
              },
            }}
            sx={{
              "& .MuiInput-underline:before": { borderBottom: "none" },
              "& .MuiInput-underline:after": { borderBottom: "none" },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                borderBottom: "none",
              },
              width: 80,
            }}
          />
        </Stack>
        {/* The change is here: */}
        <Box sx={{ width: "100%", textAlign: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ color: "#666", fontWeight: "medium" }}>
            Current Timer: {formatTime(timeLeft)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3, pt: 0 }}>
        <Button
          onClick={handleStart}
          variant="contained"
          color="primary"
          disabled={isRunning || calculateTotalSeconds() === 0}
          sx={{
            borderRadius: 2,
            minWidth: 100,
            py: 1,
            px: 3,
            bgcolor: "#007AFF",
            "&:hover": { bgcolor: "#0056b3" },
          }}
        >
          {isRunning ? "Running" : "Start"}
        </Button>
        <Button
          onClick={handleStop}
          variant="outlined"
          color="secondary"
          disabled={!isRunning}
          sx={{
            borderRadius: 2,
            minWidth: 100,
            py: 1,
            px: 3,
            borderColor: "#FF3B30",
            color: "#FF3B30",
            "&:hover": {
              borderColor: "#CC0000",
              color: "#CC0000",
              bgcolor: "rgba(255, 59, 48, 0.08)",
            },
          }}
        >
          Stop
        </Button>
        <Button
          onClick={() => {
            dispatch(setTimer(0));
            setInputHours(""); // Reset to empty string for re-typing
            setInputMinutes("");
            setInputSeconds("");
            handleStop(); // Stop timer if running on reset
          }}
          variant="text"
          color="inherit"
          disabled={isRunning}
          sx={{
            minWidth: 80,
            py: 1,
            px: 2,
            color: "#888",
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
          }}
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
}
