import { Box, Typography, IconButton, Paper } from "@mui/material";
import { useState, useMemo } from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function MonthlyCalendarHeatmap({ habitStats }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar data for the current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const completionMap = new Map();
    
    // show empty calendar if no habitat stats
    if (!habitStats) {
      const calendar = [];
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startDayOfWeek; i++) {
        calendar.push(null);
      }
      
      // Add all days of the month without any status data
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const today = new Date();
        const isToday = date.getDate() === today.getDate() && 
                       date.getMonth() === today.getMonth() && 
                       date.getFullYear() === today.getFullYear();
        
        calendar.push({
          date: date,
          day: day,
          status: null,
          isToday: isToday,
          dateKey: `${year}-${month}-${day}`
        });
      }
      
      return calendar;
    }
    
    if (habitStats.completedDates && Array.isArray(habitStats.completedDates)) {
      habitStats.completedDates.forEach((dateStr) => {
        const entryDate = new Date(dateStr);
        const dateKey = `${entryDate.getFullYear()}-${entryDate.getMonth()}-${entryDate.getDate()}`;
        completionMap.set(dateKey, 'complete');
      });
    }
    
    if (habitStats.failedDates && Array.isArray(habitStats.failedDates)) {
      habitStats.failedDates.forEach((dateStr) => {
        const entryDate = new Date(dateStr);
        const dateKey = `${entryDate.getFullYear()}-${entryDate.getMonth()}-${entryDate.getDate()}`;
        completionMap.set(dateKey, 'failed');
      });
    }
    
    if (habitStats.skippedDates && Array.isArray(habitStats.skippedDates)) {
      habitStats.skippedDates.forEach((dateStr) => {
        const entryDate = new Date(dateStr);
        const dateKey = `${entryDate.getFullYear()}-${entryDate.getMonth()}-${entryDate.getDate()}`;
        completionMap.set(dateKey, 'skipped');
      });
    }

    if (completionMap.size === 0 && habitStats.dailyStatuses && Array.isArray(habitStats.dailyStatuses)) {
      habitStats.dailyStatuses.forEach((entry) => {
        const entryDate = new Date(entry.date);
        const dateKey = `${entryDate.getFullYear()}-${entryDate.getMonth()}-${entryDate.getDate()}`;
        const status = entry.status === 'incomplete' ? 'failed' : entry.status;
        completionMap.set(dateKey, status);
      });
    }
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
    
    const calendar = [];
    
    for (let i = 0; i < startDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = `${year}-${month}-${day}`;
      const status = completionMap.get(dateKey) || null;
      
      const today = new Date();
      const isToday = date.getDate() === today.getDate() && 
                     date.getMonth() === today.getMonth() && 
                     date.getFullYear() === today.getFullYear();
      
      calendar.push({
        date: date,
        day: day,
        status: status,
        isToday: isToday,
        dateKey: dateKey
      });
    }
    
    return calendar;
  }, [currentDate, habitStats?.completedDates, habitStats?.failedDates, habitStats?.skippedDates, habitStats?.dailyStatuses]);

  // Group calendar data into weeks
  const weeks = useMemo(() => {
    const weekArray = [];
    for (let i = 0; i < calendarData.length; i += 7) {
      weekArray.push(calendarData.slice(i, i + 7));
    }
    return weekArray;
  }, [calendarData]);

  const getColor = (dayData) => {
    if (!dayData) return 'transparent';
    
    if (dayData.isToday) {
      return dayData.status === 'complete' ? '#16a34a' : '#fecaca';
    }
    
    switch (dayData.status) {
      case 'complete':
        return '#379e5dff';
      case 'failed':
        return '#fd1818ff';
      case 'skipped':
        return '#f59e0b';
      default:
        return '#f3f4f6';
    }
  };

  const getTooltipText = (dayData) => {
    if (!dayData) return '';
    
    const dateStr = dayData.date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    if (dayData.isToday) {
      return `${dateStr} (Today): ${dayData.status === 'complete' ? 'Completed' : 'Not completed yet'}`;
    }
    
    switch (dayData.status) {
      case 'complete':
        return `${dateStr}: Completed`;
      case 'failed':
        return `${dateStr}: Failed`;
      case 'skipped':
        return `${dateStr}: Skipped`;
      default:
        return `${dateStr}: No data`;
    }
  };

  const monthName = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        maxWidth: 600,
        margin: '0 auto'
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          mb: 2,
        }}
      >
        <IconButton onClick={goToPreviousMonth} size="small">
          <ArrowBackIosIcon />
        </IconButton>
        
        <Typography variant="h6" sx={{ fontWeight: "bold", minWidth: 200, textAlign: 'center' }}>
          {monthName}
        </Typography>
        
        <IconButton onClick={goToNextMonth} size="small">
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          width: "100%",
          mb: 1,
        }}
      >
        {dayLabels.map((label) => (
          <Box
            key={label}
            sx={{
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
              color: "text.secondary",
            }}
          >
            {label}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          width: "100%",
        }}
      >
        {weeks.flat().map((dayData, index) => (
          <Paper
            key={index}
            elevation={dayData ? 1 : 0}
            title={getTooltipText(dayData)}
            sx={{
              height: 40,
              backgroundColor: getColor(dayData),
              borderRadius: 1,
              cursor: dayData ? "pointer" : "default",
              border: dayData && dayData.isToday ? "2px solid #1976d2" : "none",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: dayData && dayData.isToday ? "bold" : "normal",
              color: dayData && dayData.status === 'complete' ? 'white' : 'inherit',
              "&:hover": dayData ? {
                transform: "scale(1.05)",
                zIndex: 1,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              } : {},
            }}
          >
            {dayData ? dayData.day : ''}
          </Paper>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 3,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <Typography variant="caption" sx={{ mr: 1 }}>
          Legend:
        </Typography>
        {[
          { color: '#f3f4f6', label: 'No data' },
          { color: '#22c55e', label: 'Completed' },
          { color: '#f59e0b', label: 'Skipped' },
          { color: '#ef4444', label: 'Failed' },
        ].map((item, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: item.color,
                borderRadius: 0.5,
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            />
            <Typography variant="caption">{item.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
