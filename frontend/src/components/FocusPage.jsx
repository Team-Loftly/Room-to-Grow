import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Modal,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
}
 from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CelebrationIcon from '@mui/icons-material/Celebration';

import { Room } from "./Room.jsx";
import TimerDisplay from "./TimerDisplay";
import { fetchTasks, setSelectedTaskId } from '../features/tasksSlice.js';
import { stopTimer, startTimer } from '../features/timerSlice.js';

const FocusPage = () => {
  const dispatch = useDispatch();
  const isRunning = useSelector((state) => state.timer.isRunning);

  const allTasks = useSelector((state) => state.tasks.taskList);
  const selectedTaskId = useSelector((state) => state.tasks.selectedTaskId);

  const [isHabitCompletedSnackbarOpen, setIsHabitCompletedSnackbarOpen] = useState(false);
  const [completedHabitTitle, setCompletedHabitTitle] = useState('');
  const [secondsCounter, setSecondsCounter] = useState(0); // Track seconds counter from TimerDisplay
  const [wasTimerRunning, setWasTimerRunning] = useState(false); // Track if timer was running before confirmation
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    action: null, // 'deselect' or 'select'
    newTaskId: null,
  });

  const timedTasks = allTasks.filter(task => task.type === "timed");

  // Fetch tasks when the component mounts
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Handler called by TimerDisplay when a habit is completed
  const handleHabitComplete = useCallback((habitTitle) => {
    setCompletedHabitTitle(habitTitle);
    setIsHabitCompletedSnackbarOpen(true);
    // Deselect the task since it's now complete
    dispatch(setSelectedTaskId({ taskId: -1 }));
  }, [dispatch]);

  // Handler to receive seconds counter updates from TimerDisplay
  const handleSecondsCounterChange = useCallback((counter) => {
    setSecondsCounter(counter);
  }, []);

  // display only timed tasks
  const currentTask = timedTasks.find(task => task._id === selectedTaskId);

  const handleTaskSelect = useCallback((taskId) => {
    // Check for unsaved progress OR timer running
    if ((secondsCounter > 0 || isRunning) && selectedTaskId !== taskId) {
      // Remember if timer was running before stopping it
      setWasTimerRunning(isRunning);
      if (isRunning) {
        dispatch(stopTimer());
      }
      setConfirmationDialog({
        open: true,
        action: 'select',
        newTaskId: taskId,
      });
    } else {
      dispatch(setSelectedTaskId({ taskId }));
    }
  }, [dispatch, secondsCounter, selectedTaskId, isRunning]);

  const handleDeselectTask = useCallback(() => {
    // Check for unsaved progress OR timer running
    if (secondsCounter > 0 || isRunning) {
      // Remember if timer was running before stopping it
      setWasTimerRunning(isRunning);
      if (isRunning) {
        dispatch(stopTimer());
      }
      setConfirmationDialog({
        open: true,
        action: 'deselect',
        newTaskId: null,
      });
    } else {
      dispatch(setSelectedTaskId({ taskId: -1 }));
    }
  }, [dispatch, secondsCounter, isRunning]);

  const handleConfirmationClose = useCallback(() => {
    // If timer was running before confirmation, restart it
    if (wasTimerRunning) {
      dispatch(startTimer());
    }
    setWasTimerRunning(false);
    setConfirmationDialog({ open: false, action: null, newTaskId: null });
  }, [dispatch, wasTimerRunning]);

  const handleConfirmationConfirm = useCallback(() => {
    if (confirmationDialog.action === 'deselect') {
      dispatch(setSelectedTaskId({ taskId: -1 }));
    } else if (confirmationDialog.action === 'select') {
      dispatch(setSelectedTaskId({ taskId: confirmationDialog.newTaskId }));
    }
    
    // Close the dialog and reset timer state (don't restart timer since user confirmed the action)
    setWasTimerRunning(false);
    setConfirmationDialog({ open: false, action: null, newTaskId: null });
  }, [dispatch, confirmationDialog]);

  const handleHabitCompletedModalClose = useCallback(() => {
    setIsHabitCompletedSnackbarOpen(false);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '90vh',
        width: '100vw',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        p: 4,
        boxSizing: 'border-box',
        gap: 4,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <TimerDisplay 
          onHabitComplete={handleHabitComplete} 
          onDeselectTask={handleDeselectTask}
          onSecondsCounterChange={handleSecondsCounterChange}
        />
      </Box>

      <Paper
        sx={{
          flex: '0 0 40%',
          minWidth: '300px',
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >

        <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex' }}>
          <Room isRunning={isRunning} />
        </Box>

        <Box sx={{ flexShrink: 0, overflowY: 'auto' }}>
          <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
            <Box component="span" sx={{ color: 'red', mr: 0.5 }}>
              |
            </Box>
            Today's Timed Habits
          </Typography>
          <List dense sx={{ p: 0 }}>
            {timedTasks.length > 0 ? (
              timedTasks.map((task) => (
                <ListItem
                  key={task._id}
                  disablePadding
                  onClick={() => handleTaskSelect(task._id)}
                  sx={{
                    bgcolor: task._id === selectedTaskId ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    mb: 1,
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {task.progress.status === 'complete' ? (
                      <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    ) : task._id === selectedTaskId ? (
                      <RadioButtonCheckedIcon sx={{ color: 'white', fontSize: 20 }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ color: 'white', fontSize: 20 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          color: task.progress.status === 'complete' ? 'text.disabled' : 'white',
                          textDecoration: task.progress.status === 'complete' ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: 'flex', ml: 1 }}>
                    {[...Array(task.circles || 3)].map((_, i) => (
                      <FiberManualRecordIcon
                        key={i}
                        sx={{ fontSize: 10, color: 'grey.600' }}
                      />
                    ))}
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography sx={{ color: 'white', opacity: 0.7 }}>
                No timed habits for today.
              </Typography>
            )}
          </List>
        </Box>
      </Paper>
      
      <Modal
        open={isHabitCompletedSnackbarOpen}
        onClose={handleHabitCompletedModalClose}
        onClick={handleHabitCompletedModalClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={isHabitCompletedSnackbarOpen}>
          <Paper
            sx={{
              bgcolor: 'rgba(9, 92, 39, 1)',
              color: 'white',
              borderRadius: 4,
              p: 4,
              textAlign: 'center',
              minWidth: 400,
              maxWidth: 500,
              boxShadow: 24,
              outline: 'none',
              border: 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CelebrationIcon sx={{ fontSize: 29, mr: 1, color: 'yellow' }} />
              <Typography variant="h5">
                {completedHabitTitle} completed!
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 'bold' }}>
              +5 coins earned
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8, fontSize: '0.9rem' }}>
              Click anywhere to close
            </Typography>
          </Paper>
        </Fade>
      </Modal>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationDialog.open}
        onClose={handleConfirmationClose}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Confirm Action
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmationDialog.action === 'deselect' 
              ? 'You have unsaved progress from the current minute. This will deselect the habit and the unsaved progress will be lost.'
              : 'You have unsaved progress from the current minute. This will switch to a different habit and the unsaved progress will be lost.'
            }
          </Typography>
          <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
            Do you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleConfirmationClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmationConfirm} 
            variant="contained" 
            sx={{
              bgcolor: '#16a34a',
              '&:hover': {
                bgcolor: '#15803d',
              },
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FocusPage;