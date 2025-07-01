import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDropDownIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { deleteTask, updateCheckmarkProgress } from "../../features/tasksSlice";
import { addCoinsAndUpdate } from "../../features/inventorySlice";
import { completeTask } from "../../features/metricsSlice";

export default function TaskCard({ task }) {
  const [completion, setCompletion] = React.useState(false);
  const [remove, setRemove] = React.useState(false);
  const dispatch = useDispatch();

  // Updates task progress when a checkbox is clicked.
  // When last checkbox is ticked, deletes the task, rewards the user with coins, and updates metrics.
  const handleCheckBox = (index, checked) => {
    const isIncrement = checked && index == task.progress;
    const isDecrement = !checked && index == task.progress - 1;
    let newProgress;

    if (isIncrement) {
      dispatch(updateCheckmarkProgress({ taskId: task.id, progressMade: 1 }));
      newProgress = task.progress + 1;
    } else if (isDecrement) {
      dispatch(updateCheckmarkProgress({ taskId: task.id, progressMade: -1 }));
      newProgress = task.progress - 1;
    } else {
      newProgress = task.progress;
    }

    if (newProgress == task.checkmarks) {
      setCompletion(true);
      dispatch(addCoinsAndUpdate(100));
      dispatch(completeTask());
      setTimeout(() => {
        dispatch(deleteTask(task.id));
      }, 6000);
    }
  };

  // Deletes task when "Delete button is pressed."
  const handleDelete = () => {
    setRemove(true);
    setTimeout(() => {
      dispatch(deleteTask(task.id));
    }, 6000);
  };

  const handleClose = (event, reason) => {
    if (reason == "clickaway") {
      return;
    }
    setCompletion(false);
  };

  // Calculations for displaying progress bar for timed tasks
  const isTimedTask = task.type == "timed";
  const goalInMinutes = (task.hours || 0) * 60 + (task.minutes || 0);
  const progressPercentage =
    goalInMinutes > 0 ? (task.progress / goalInMinutes) * 100 : 0;
  const progressHours = Math.floor(task.progress / 60);
  const progressMinutes = task.progress - progressHours * 60;

  return (
    <Box>
      <Snackbar
        open={completion}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Task completed! Great work :)"
      />
      <Snackbar
        open={remove}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Task deleted."
      />
      <Collapse in={!completion && !remove}>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flex
              sx={{
                width: "90%",
              }}
            >
              <Stack direction="column" spacing={1}>
                <Typography>{task.title}</Typography>
              </Stack>
              {isTimedTask && (
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                  />
                  <Typography variant="caption">
                    {progressHours}h {progressMinutes}m completed out of{" "}
                    {task.hours}h {task.minutes}m
                  </Typography>
                </Box>
              )}
              {!isTimedTask && (
                <Stack direction="row" spacing={1}>
                  {Array.from({ length: task.checkmarks }, (_, index) => (
                    <Checkbox
                      key={index}
                      size="small"
                      checked={index < (task.progress || 0)}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={(e) => {
                        handleCheckBox(index, e.target.checked);
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="column" spacing={1}>
              <Typography variant="caption">
                Description: {task.description}
              </Typography>
              <Button onClick={handleDelete}>Delete</Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Collapse>
    </Box>
  );
}
