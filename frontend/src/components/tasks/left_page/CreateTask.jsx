import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "../../../features/tasksSlice";

// Material-UI Components
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

// Dialog Components
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Constants
const hourOptions = Array.from({ length: 24 }, (_, index) => index);
const minuteOptions = Array.from({ length: 60 }, (_, index) => index);
const checkmarkOptions = Array.from({ length: 12 }, (_, index) => index + 1);
const daysOfTheWeek = [
  { value: "Sunday", label: "Su" },
  { value: "Monday", label: "Mo" },
  { value: "Tuesday", label: "Tu" },
  { value: "Wednesday", label: "We" },
  { value: "Thursday", label: "Th" },
  { value: "Friday", label: "Fr" },
  { value: "Saturday", label: "Sa" },
];
const allDayValues = daysOfTheWeek.map((day) => day.value);

export default function CreateTask({
  ExistingTask,
  onClose,
  openEditMenuDialog,
}) {
  const emptyTask = {
    title: "",
    description: "",
    days: allDayValues,
    priority: 3,
    type: "checkmark",
    hours: null,
    minutes: null,
    checkmarks: 1,
  };

  const [taskValues, setTaskValues] = useState(emptyTask);
  const dispatch = useDispatch();

  useEffect(() => {
    if (ExistingTask) {
      setTaskValues(ExistingTask);
      setOpen(openEditMenuDialog);
    }
  }, [ExistingTask]);

  const handleClickOpen = () => {
    setTaskValues(emptyTask);
    setOpen(true);
  };

  const [open, setOpen] = useState(false); // State for Dialog open/close

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleAutocompleteInput = (field) => (_, newValue) => {
    setTaskValues((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleDaysInput = (event, newDays) => {
    setTaskValues((prevValues) => ({
      ...prevValues,
      days: newDays,
    }));
  };

  const handleBasicInput = (event) => {
    const { name, value } = event.target;

    setTaskValues((prevValues) => {
      let updated = { ...prevValues, [name]: value };
      if (name === "type") {
        if (value === "timed") {
          updated.checkmarks = null;
        } else if (value === "checkmark") {
          updated.hours = null;
          updated.minutes = null;
        }
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    const valid = isValid(taskValues);
    if (!valid) {
      console.warn("Form is not valid. Please fill all required fields.");
      return;
    }
    if (ExistingTask) {
      dispatch(updateTask(taskValues));
    } else {
      dispatch(addTask(taskValues));
    }
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  function isValid(task) {
    if (!task.title || !task.priority || !task.type) {
      return false;
    } else if (task.days.length === 0) {
      return false;
    } else if (task.type === "timed") {
      if (task.hours === null || task.minutes === null) {
        return false;
      }
      return task.hours !== 0 || task.minutes !== 0;
    } else if (task.type === "checkmark") {
      return task.checkmarks !== null;
    }
    return true;
  }
  const valid = isValid(taskValues);

  return (
    <Box>
      {!ExistingTask && (
        <Button variant="contained" onClick={handleClickOpen}>
          Add Habit
        </Button>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Habit</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Fill in the details for your new habit.
          </DialogContentText>
          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={2} sx={{ width: "100%" }}>
              <TextField
                label="Title"
                placeholder="Title"
                size="small"
                required
                name="title"
                value={taskValues.title}
                onChange={handleBasicInput}
                fullWidth
              />
              <TextField
                label="Description"
                placeholder="Description"
                size="small"
                name="description"
                value={taskValues.description}
                onChange={handleBasicInput}
                fullWidth
                multiline
                rows={2}
              />
              <Box sx={{ flex: 1 }}>
                <ToggleButtonGroup
                  value={taskValues.days}
                  onChange={handleDaysInput}
                  size="small"
                  fullWidth
                >
                  {daysOfTheWeek.map((day) => (
                    <ToggleButton key={day.value} value={day.value}>
                      {day.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
              <FormControl size="small" required fullWidth>
                <InputLabel id="select-task-type-label">Type</InputLabel>
                <Select
                  labelId="select-task-type-label"
                  id="select-task-type"
                  label="Type"
                  name="type"
                  value={taskValues.type}
                  onChange={handleBasicInput}
                >
                  <MenuItem value={"timed"}>Timed</MenuItem>
                  <MenuItem value={"checkmark"}>Checkmark</MenuItem>
                </Select>
              </FormControl>

              <Collapse in={taskValues.type === "timed"}>
                <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                  <Autocomplete
                    size="small"
                    options={hourOptions}
                    getOptionLabel={(option) =>
                      typeof option === "number" ? `${option} h` : ""
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Hours" />
                    )}
                    value={taskValues.hours}
                    onChange={handleAutocompleteInput("hours")}
                    sx={{ width: "100%" }}
                  />
                  <Autocomplete
                    size="small"
                    options={minuteOptions}
                    getOptionLabel={(option) =>
                      typeof option === "number" ? `${option} m` : ""
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Minutes" />
                    )}
                    value={taskValues.minutes}
                    onChange={handleAutocompleteInput("minutes")}
                    sx={{ width: "100%" }}
                  />
                </Stack>
              </Collapse>
              <Collapse in={taskValues.type === "checkmark"}>
                <Autocomplete
                  size="small"
                  options={checkmarkOptions}
                  getOptionLabel={(option) =>
                    typeof option === "number" ? `${option} times` : ""
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Times per day" />
                  )}
                  value={taskValues.checkmarks}
                  onChange={handleAutocompleteInput("checkmarks")}
                  sx={{ width: "100%", mt: -2, mb: 1 }}
                />
              </Collapse>
              <FormControl size="small" fullWidth>
                <InputLabel id="select-priority-label">Priority</InputLabel>
                <Select
                  labelId="select-priority-label"
                  id="select-priority"
                  label="Priority"
                  name="priority"
                  value={taskValues.priority}
                  onChange={handleBasicInput}
                >
                  <MenuItem value={3}>Low</MenuItem>
                  <MenuItem value={2}>Medium</MenuItem>
                  <MenuItem value={1}>High</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ m: 1, mr: 2 }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!valid}
            onClick={handleSubmit}
            sx={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
