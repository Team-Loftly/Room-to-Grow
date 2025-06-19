import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDropDownIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { deleteTask } from "../../features/tasksSlice";

export default function TaskCard({ task }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };

  const isTimedTask = task.type == "timed";

  const goalInMinutes = (task.hours || 0) * 60 + (task.minutes || 0);
  const progressPercentage =
    goalInMinutes > 0 ? (task.progress / goalInMinutes) * 100 : 0;
  const progressHours = Math.floor(task.progress / 60);
  const progressMinutes = task.progress - progressHours * 60;

  return (
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
                  defaultChecked={index < (task.progress || 0)}
                  onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
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
  );
}
