import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Modal,
  Fade,
}
 from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CelebrationIcon from '@mui/icons-material/Celebration';

import { Room } from "./Room.jsx";
import TimerDisplay from "./TimerDisplay";
import { fetchTasks, setSelectedTaskId } from '../features/tasksSlice.js';
import { stopTimer } from '../features/timerSlice.js';

const FocusPage = () => {
  const dispatch = useDispatch();
  const isRunning = useSelector((state) => state.timer.isRunning);

  const allTasks = useSelector((state) => state.tasks.taskList);
  const selectedTaskId = useSelector((state) => state.tasks.selectedTaskId);

  const [isHabitCompletedSnackbarOpen, setIsHabitCompletedSnackbarOpen] = useState(false);
  const [completedHabitTitle, setCompletedHabitTitle] = useState('');

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

  // display only timed tasks
  const currentTask = timedTasks.find(task => task._id === selectedTaskId);

  const handleTaskSelect = useCallback((taskId) => {
    dispatch(setSelectedTaskId({ taskId }));
  }, [dispatch]);

  const handleDeselectTask = useCallback(() => {
    dispatch(setSelectedTaskId({ taskId: -1 }));
  }, [dispatch]);

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
        <TimerDisplay onHabitComplete={handleHabitComplete} onDeselectTask={handleDeselectTask} />
      </Box>

      <Paper
        sx={{
          flex: '0 0 40%',
          minWidth: '300px',
          bgcolor: 'rgba(171, 171, 171, 0.93)',
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
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
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
              bgcolor: 'success.main',
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
    </Box>
  );
};

export default FocusPage;