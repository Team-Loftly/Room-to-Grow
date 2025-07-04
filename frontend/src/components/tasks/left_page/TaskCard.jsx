import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteTask,
  setSelectedTaskId,
  updateProgress,
  setIsDeleteSnackbarOpen,
  setIsCompletionSnackbarOpen,
  markSkipped,
  markFailed,
} from "../../../features/tasksSlice";
import { addCoinsAndUpdate } from "../../../features/inventorySlice";
import { completeTask } from "../../../features/metricsSlice";
import CreateTask from "./CreateTask";
import LogTimeDialog from "./LogTimeDialog";

export default function TaskCard({ task, task_status }) {
  const deleteSnackbarOpen = useSelector(
    (state) => state.tasks.isDeleteSnackbarOpen
  );
  const completionSnackbarOpen = useSelector(
    (state) => state.tasks.isCompletionSnackbarOpen
  );
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const dispatch = useDispatch();
  const selectedTaskId = useSelector((state) => state.tasks.selectedTaskId);

  const isSelected = selectedTaskId === task._id;
  const [openEditMenuDialog, setOpenEditMenuDialog] = React.useState(false);

  const [openLogTimeDialog, setOpenLogTimeDialog] = React.useState(false);

  const dayMap = {
    "Sunday": 'Su',
    "Monday": 'Mo',
    "Tuesday": 'Tu',
    "Wednesday": 'We',
    "Thursday": 'Th',
    "Friday": 'Fr',
    "Saturday": 'Sa',
  };

  const formatDays = (daysArray) => {
    if (!daysArray || daysArray.length === 0) {
      return 'No specific days';
    }
    return daysArray
      .map(dayNum => dayMap[dayNum])
      .filter(name => name)
      .join(', ');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    handleTaskCardClick();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setOpenEditMenuDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditMenuDialog(false);
  };

  const handleLogTimeClick = () => {
    setOpenLogTimeDialog(true);
  };

  const handleLogTimeDialogClose = () => {
    setOpenLogTimeDialog(false);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    dispatch(setSelectedTaskId({ taskId: -1 }));
    dispatch(deleteTask(task._id));
  };

  const handleUndo = () => {
    handleMenuClose();
    dispatch(updateProgress({ taskId: task._id, value: -task.progress.value }));
  };

  const handleSkip = () => {
    handleMenuClose();
    dispatch(markSkipped(task._id));
  };

  const handleFail = () => {
    handleMenuClose();
    dispatch(markFailed(task._id));
  };

  const handleTaskCardClick = () => {
    if (isSelected) {
      dispatch(setSelectedTaskId({ taskId: -1 }));
    } else {
      dispatch(setSelectedTaskId({ taskId: task._id }));
    }
  };

  const handleCompleteTask = () => {
    dispatch(addCoinsAndUpdate(100));
    // dispatch(completeTask()); // Update metrics
    dispatch(setIsCompletionSnackbarOpen(true));
  };

  const handleDecrement = () => {
    dispatch(updateProgress({ taskId: task._id, value: -1 }));
  };

  const handleIncrement = () => {
    dispatch(updateProgress({ taskId: task._id, value: 1 }));
    if (task.progress.value + 1 === task.checkmarks) {
      handleCompleteTask();
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setIsCompletionSnackbarOpen(false));
    dispatch(setIsDeleteSnackbarOpen(false));
  };

  // Calculations for displaying progress bar for timed tasks
  const isTimedTask = task.type === "timed";
  const goalInMinutes = (task.hours || 0) * 60 + (task.minutes || 0);

  const progressPercentage = task.progress
    ? isTimedTask
      ? (task.progress.value / goalInMinutes) * 100
      : (task.progress.value / task.checkmarks) * 100
    : 0;

  const progressHours = task.progress
    ? Math.floor(task.progress.value / 60)
    : 0;
  const progressMinutes = task.progress ? task.progress.value % 60 : 0; // Use modulo for minutes

  return (
    <Box>
      <Snackbar
        open={completionSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Task completed! Great work :)"
      />
      <Snackbar
        open={deleteSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Task deleted."
      />
      <Paper
        elevation={isSelected ? 4 : 1}
        sx={{
          p: 2,
          borderRadius: 2,
          transition: "background-color 0.3s, box-shadow 0.3s",
          "&:hover": {
            backgroundColor: "#eeeeee",
            cursor: "pointer",
          },
          backgroundColor: isSelected ? "#d3d3d3" : "background.paper",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
        onClick={handleTaskCardClick}
      >
        <Stack
          direction="column"
          spacing={1}
          sx={{
            flexGrow: 1,
            pr: 1,
          }}
        >
          <Typography variant="h6">{task.title}</Typography>
          {task.description && (
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          )}

          {task.progress && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{ mb: 0.5 }}
              />
              {isTimedTask ? (
                <Typography variant="caption" color="text.secondary">
                  {progressHours}h {progressMinutes}m completed out of{" "}
                  {task.hours}h {task.minutes}m
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  {task.progress.value} completed out of {task.checkmarks}
                </Typography>
              )}
            </Box>
          )}

          {!task.progress && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Scheduled: {formatDays(task.days)}
              </Typography>
            </Box>
          )}
        </Stack>
        {task.progress && !task_status && !isTimedTask && (
          <>
            <IconButton
              aria-label="decrement"
              onClick={(e) => {
                e.stopPropagation();
                handleDecrement();
              }}
              sx={{ alignSelf: "flex-start", mt: -1, mr: -1 }}
            >
              <RemoveIcon />
            </IconButton>

            <IconButton
              aria-label="increment"
              onClick={(e) => {
                e.stopPropagation();
                handleIncrement();
              }}
              sx={{ alignSelf: "flex-start", mt: -1, mr: -1 }}
            >
              <AddIcon />
            </IconButton>
          </>
        )}

        {task.progress && !task_status && isTimedTask && (
          <IconButton
            aria-label="log_time"
            onClick={(e) => {
              e.stopPropagation();
              handleLogTimeClick();
            }}
            sx={{ alignSelf: "flex-start", mt: -1, mr: -1 }}
          >
            <AlarmOnIcon />
          </IconButton>
        )}
        <IconButton
          aria-label="more"
          aria-controls={menuOpen ? "long-menu" : undefined}
          aria-expanded={menuOpen ? "true" : undefined}
          aria-haspopup="true"
          onClick={(e) => {
            e.stopPropagation();
            handleMenuClick(e);
          }}
          sx={{ alignSelf: "flex-start", mt: -1, mr: -1 }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          slotProps={{
            list: {
              "aria-labelledby": "long-button",
            },
          }}
        >
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>

          <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
          {task.progress && task_status && (
            <MenuItem onClick={handleUndo}>Undo {task_status}</MenuItem>
          )}
          {task.progress && !task_status && (
            <>
              <MenuItem onClick={handleSkip}>
                Mark Skipped {task_status}
              </MenuItem>
              <MenuItem onClick={handleFail}>
                Mark Failed {task_status}
              </MenuItem>
            </>
          )}
        </Menu>
      </Paper>
      {openEditMenuDialog && (
        <CreateTask
          ExistingTask={task}
          onClose={handleEditDialogClose}
          openEditMenuDialog={openEditMenuDialog}
        />
      )}

      {openLogTimeDialog && (
        <LogTimeDialog
          currentTask={task}
          onClose={handleLogTimeDialogClose}
          open={openLogTimeDialog}
          handleCompleteTask={handleCompleteTask}
        />
      )}
    </Box>
  );
}
