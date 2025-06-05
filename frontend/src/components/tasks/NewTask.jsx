import * as React from "react";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

export default function NewTask() {
  const emptyForm = {
    title: "",
    description: "",
    days: [],
    priority: "",
    type: "",
    goalHours: "",
    goalMinutes: "",
  };

  const [formValues, setFormValues] = React.useState(emptyForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleDaysChange = (event, newDays) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      days: newDays,
    }));
  };

  const handleCancel = () => {
    setFormValues(emptyForm);
  };

  const timed = Array.from(new Array(60)).map((_, index) => `${index} m`);

  const timedOptions = Array.from(new Array(24 * 4)).map((_, index) => {
    const hour = Math.floor(index / 4);
    const minuteIncrement = index % 4;

    let minutes;
    if (minuteIncrement === 0) {
      minutes = "00";
    } else if (minuteIncrement === 1) {
      minutes = "15";
    } else if (minuteIncrement === 2) {
      minutes = "30";
    } else {
      minutes = "45";
    }

    return `${hour}h ${minutes}min`;
  });

  const checkmarkOptions = Array.from(new Array(12)).map(
    (_, index) => `${index} times`
  );

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        bgcolor: "white",
        p: 3,
      }}
    >
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Typography component="span">New Task</Typography>
        <TextField
          label="Title"
          placeholder="Title"
          size="small"
          required
          name="title"
          value={formValues.title}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Description"
          placeholder="Description"
          size="small"
          name="description"
          value={formValues.description}
          onChange={handleChange}
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
            value={formValues.priority}
            onChange={handleChange}
          >
            <MenuItem value={1}>Low</MenuItem>
            <MenuItem value={2}>Medium</MenuItem>
            <MenuItem value={3}>High</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ flex: 1 }}>
          {/* <Typography variant="body2" sx={{ mb: 1 }}>
                Repeat On:
              </Typography> */}
          <ToggleButtonGroup
            value={formValues.days}
            onChange={handleDaysChange}
            size="small"
            fullWidth
          >
            <ToggleButton value="Sunday">Su</ToggleButton>
            <ToggleButton value="Monday">Mo</ToggleButton>
            <ToggleButton value="Tuesday">Tu</ToggleButton>
            <ToggleButton value="Wednesday">We</ToggleButton>
            <ToggleButton value="Thursday">Th</ToggleButton>
            <ToggleButton value="Friday">Fr</ToggleButton>
            <ToggleButton value="Saturday">Sa</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <FormControl size="small" required fullWidth>
          <InputLabel id="select-task-type-label">Type</InputLabel>
          <Select
            labelId="select-task-type-label"
            id="select-task-type"
            label="Type"
            name="type"
            value={formValues.type}
            onChange={handleChange}
          >
            <MenuItem value={"timed"}>Timed</MenuItem>
            <MenuItem value={"checkmark"}>Checkmark</MenuItem>
          </Select>
        </FormControl>

        <Collapse in={formValues.type === "timed"}>
          <Autocomplete
            options={timedOptions}
            renderInput={(params) => (
              <TextField {...params} label="Daily Goal" />
            )}
          />
        </Collapse>
        <Collapse in={formValues.type === "checkmark"}>
          <Autocomplete
            options={checkmarkOptions}
            renderInput={(params) => (
              <TextField {...params} label="Daily Goal" />
            )}
          />
        </Collapse>

        <Button variant="contained">Save</Button>
        <Button
          variant="outlined"
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
