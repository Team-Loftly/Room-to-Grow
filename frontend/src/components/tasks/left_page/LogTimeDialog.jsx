import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import { updateProgress } from "../../../features/tasksSlice";
import { addCoinsAndUpdate } from "../../../features/roomSlice";
import { completeTask } from "../../../features/metricsSlice";

export default function LogTimeDialog({
  open,
  onClose,
  currentTask,
  handleCompleteTask,
}) {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      setHours("");
      setMinutes("");
    }
  }, [open, currentTask]);

  const handleLog = () => {
    const loggedHours = parseInt(hours, 10) || 0;
    const loggedMinutes = parseInt(minutes, 10) || 0;
    const totalLoggedMinutes = loggedHours * 60 + loggedMinutes;

    if (totalLoggedMinutes === 0) {
      alert("Please enter hours or minutes to log.");
      return;
    }

    dispatch(
      updateProgress({ taskId: currentTask._id, value: totalLoggedMinutes })
    );

    const currentProgressMinutes = currentTask.progress.value || 0;
    const goalInMinutes =
      (currentTask.hours || 0) * 60 + (currentTask.minutes || 0);

    if (currentProgressMinutes + totalLoggedMinutes >= goalInMinutes) {
      handleCompleteTask();
    }

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Log Time for "{currentTask?.title}"</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Hours"
            type="number"
            value={hours}
            onChange={(e) => {
              const val = e.target.value;
              setHours(val === "" ? "" : Math.max(0, parseInt(val, 10)));
            }}
            fullWidth
            slotProps={{
              input: {
                min: 0,
                onWheel: (e) => e.target.blur(),
              },
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">h</InputAdornment>,
            }}
          />
          <TextField
            label="Minutes"
            type="number"
            value={minutes}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setMinutes("");
              } else {
                const parsedVal = parseInt(val, 10);
                if (!isNaN(parsedVal) && parsedVal >= 0 && parsedVal < 60) {
                  setMinutes(parsedVal);
                } else if (parsedVal >= 60) {
                  setMinutes(59);
                } else if (parsedVal < 0) {
                  setMinutes(0);
                }
              }
            }}
            fullWidth
            slotProps={{
              input: {
                min: 0,
                max: 59,
                onWheel: (e) => e.target.blur(),
              },
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">m</InputAdornment>,
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ m: 1, mr: 2 }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleLog} variant="contained">
          Log Time
        </Button>
      </DialogActions>
    </Dialog>
  );
}
