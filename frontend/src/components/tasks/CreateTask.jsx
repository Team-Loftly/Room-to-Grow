import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Autocomplete from "@mui/material/Autocomplete";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { addTask } from "../../features/tasksSlice";

const hourOptions = Array.from({ length: 24 }, (_, index) => index);
const minuteOptions = Array.from({ length: 60 }, (_, index) => index);
const checkmarkOptions = Array.from({ length: 12 }, (_, index) => index);
const daysOfTheWeek = [
  { value: "Sunday", label: "Su" },
  { value: "Monday", label: "Mo" },
  { value: "Tuesday", label: "Tu" },
  { value: "Wednesday", label: "We" },
  { value: "Thursday", label: "Th" },
  { value: "Friday", label: "Fr" },
  { value: "Saturday", label: "Sa" },
];

export default function CreateTask({ onClose }) {
  const emptyTask = {
    id: null,
    title: "",
    description: "",
    days: [],
    priority: "",
    type: "",
    hours: null,
    minutes: null,
    checkmarks: null,
  };

  const [taskValues, setTaskValues] = useState(emptyTask);
  const tasks = useSelector((state) => state.tasks.taskList);
  const dispatch = useDispatch();

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
    const taskWithId = { ...taskValues, id: Date.now() };
    dispatch(addTask(taskWithId));
    onClose?.();
  };

  const handleCancel = () => {
    onClose?.();
  };

  function isValid(task) {
    if (!task.title || !task.priority || !task.type) {
      return false;
    } else if (task.type == "timed") {
      return task.hours != null && task.minutes != null;
    } else if (task.type == "checkmark") {
      return task.checkmarks != null;
    }
  }
  const valid = isValid(taskValues);

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        bgcolor: "white",
        p: 3,
        borderRadius: 3,
      }}
    >
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
        <FormControl size="small" required sx={{ flex: 1 }}>
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
              renderInput={(params) => <TextField {...params} label="Hours" />}
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
            sx={{ width: "100%" }}
          />
        </Collapse>

        <Button
          variant="contained"
          disabled={!valid}
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#1E2939",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          sx={{ color: "#1E2939", borderColor: "#1E2939" }}
          onClick={() => {
            handleCancel();
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}
