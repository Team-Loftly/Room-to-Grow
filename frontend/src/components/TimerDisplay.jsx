import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  startTimer,
  stopTimer,
  setTimer,
  tick,
} from '../features/timerSlice';

import { Box, Typography, TextField, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const TimerDisplay = () => {
  const dispatch = useDispatch();
  const timeLeft = useSelector((state) => state.timer.timeLeft);
  const isRunning = useSelector((state) => state.timer.isRunning);

  const [inputMinutes, setInputMinutes] = useState("");
  const [inputSeconds, setInputSeconds] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  const isInitialMount = useRef(true);

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

  // Effect for timer ticking (This stays here as TimerDisplay manages the ticking UI)
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        dispatch(tick());
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isRunning) {
      dispatch(stopTimer());
      // dispatch action here if completion needs to trigger global state changes
    }
  }, [isRunning, timeLeft, dispatch]);

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

  return (
    <>
      <Box
        sx={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '2px dashed rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          mt: 4,
        }}
      >
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