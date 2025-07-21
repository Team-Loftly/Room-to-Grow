import React, { useCallback, useEffect } from 'react';
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
}
 from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { Room } from "./Room.jsx";
import TimerDisplay from "./TimerDisplay";
import { fetchTasks, setSelectedTaskId } from '../features/tasksSlice.js';

const FocusPage = () => {
  const dispatch = useDispatch();
  const isRunning = useSelector((state) => state.timer.isRunning);

  const allTasks = useSelector((state) => state.tasks.taskList);
  const selectedTaskId = useSelector((state) => state.tasks.selectedTaskId);

  const timedTasks = allTasks.filter(task => task.type === "timed");

  // Fetch tasks when the component mounts
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const focusTimeToday = '1h 15m';

  // display only timed tasks
  const currentTask = timedTasks.find(task => task._id === selectedTaskId);

  const handleTaskSelect = useCallback((taskId) => {
    dispatch(setSelectedTaskId({ taskId }));
  }, [dispatch]);

  const handleDeselectTask = useCallback(() => {
    dispatch(setSelectedTaskId({ taskId: -1 }));
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
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
        <Paper
          sx={{
            position: 'absolute',
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderRadius: 8,
            px: 3,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: '300px',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: 'white' }} />
            <Typography variant="body1">
              {currentTask ? currentTask.title : 'No timed task selected'}
            </Typography>
          </Box>
          {currentTask && (
            <IconButton size="small" sx={{ color: 'white' }} onClick={handleDeselectTask}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>

        <TimerDisplay />
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
            Today's Timed Tasks
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
                No timed tasks for today.
              </Typography>
            )}
          </List>
        </Box>
      </Paper>
    </Box>
  );
};

export default FocusPage;