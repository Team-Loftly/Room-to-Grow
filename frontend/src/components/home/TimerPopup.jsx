import React, { useEffect } from "react";
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

export default function TimerPopup() {
  const dispatch = useDispatch();
  const timeLeft = useSelector((state) => state.timer.timeLeft);
  const isRunning = useSelector((state) => state.timer.isRunning);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        dispatch(tick());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, timeLeft, dispatch]);

  const handleClose = () => {
    dispatch(closeTimer());
  };

  const handleSet = (event) => {
    const inputTime = event.target.value;
    const seconds = parseInt(inputTime, 10);
    if (!isNaN(seconds) && seconds >= 0) {
      dispatch(setTimer(seconds));
    }
  };

  const handleStart = () => {
    dispatch(startTimer());
  };
  const handleStop = () => {
    dispatch(stopTimer());
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Timer</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Set Timer (seconds)"
          type="number"
          fullWidth
          variant="outlined"
          onChange={handleSet}
          inputProps={{ min: 0 }}
        />
        <p>Time Left:</p>
        <p>{formatTime(timeLeft)}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleStart} color="primary">
          Start
        </Button>
        <Button onClick={handleStop} color="primary">
          Stop
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
