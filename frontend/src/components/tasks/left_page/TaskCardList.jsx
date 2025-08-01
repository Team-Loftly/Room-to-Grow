import { useEffect, useMemo } from "react";
import Stack from "@mui/material/Stack";
import TaskCard from "./TaskCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllTasks, fetchTasks } from "../../../features/tasksSlice";
import { Typography } from "@mui/material";
import AccordionTasks from "./AccordionTasks";

export default function TaskCardList() {
  const dispatch = useDispatch();

  const sortBy = useSelector((state) => state.sortFilter.sortBy);
  const sortDirection = useSelector((state) => state.sortFilter.sortDirection);
  const filterBy = useSelector((state) => state.sortFilter.filterBy);

  // Today's tasks
  const tasks = useSelector((state) => state.tasks.taskList);
  const completed_tasks = useSelector((state) => state.tasks.completedTaskList);
  const skipped_tasks = useSelector((state) => state.tasks.skippedTaskList);
  const failed_tasks = useSelector((state) => state.tasks.failedTaskList);
  const status = useSelector((state) => state.tasks.status);
  const error = useSelector((state) => state.tasks.error);
  const selectedDate = useSelector((state) => state.tasks.selectedDate);

  // All habits
  const showAllTasks = useSelector((state) => state.tasks.showAllTasks);
  const allTasks = useSelector((state) => state.tasks.allTaskList);
  const allHabitsStatus = useSelector((state) => state.tasks.allHabitsStatus);
  const allHabitsError = useSelector((state) => state.tasks.allHabitsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks(selectedDate));
    }
  }, [status, dispatch, selectedDate]);

  useEffect(() => {
    if (allHabitsStatus === "idle") {
      dispatch(fetchAllTasks());
    }
  }, [allHabitsStatus, dispatch]);

  const filterTasks = (tasksArray) => {
    if (filterBy === "default") {
      return tasksArray;
    }

    const priorityMap = {
      high: 1,
      medium: 2,
      low: 3,
    };
    const targetPriority = priorityMap[filterBy];

    if (targetPriority) {
      return tasksArray.filter((task) => task.priority === targetPriority);
    }

    return tasksArray;
  };

  // Sorting Helper Function
  const sortTasks = (tasksArray) => {
    let sorted = [...tasksArray];

    if (sortBy === "name") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "priority") {
      sorted.sort((a, b) => a.priority - b.priority);
    }

    if (sortDirection === "desc") {
      sorted.reverse();
    }

    return sorted;
  };

  const filteredAndSortedTasksToday = useMemo(() => {
    const filtered = filterTasks(tasks);
    return sortTasks(filtered);
  }, [tasks, filterBy, sortBy, sortDirection]);

  const filteredAndSortedAllTasks = useMemo(() => {
    const filtered = filterTasks(allTasks);
    return sortTasks(filtered);
  }, [allTasks, filterBy, sortBy, sortDirection]);

  const filteredAndSortedCompletedTasks = useMemo(() => {
    const filtered = filterTasks(completed_tasks);
    return sortTasks(filtered);
  }, [completed_tasks, filterBy, sortBy, sortDirection]);

  const filteredAndSortedSkippedTasks = useMemo(() => {
    const filtered = filterTasks(skipped_tasks);
    return sortTasks(filtered);
  }, [skipped_tasks, filterBy, sortBy, sortDirection]);

  const filteredAndSortedFailedTasks = useMemo(() => {
    const filtered = filterTasks(failed_tasks);
    return sortTasks(filtered);
  }, [failed_tasks, filterBy, sortBy, sortDirection]);

  if (allHabitsError) {
    return <Typography>Error fetching all habits: {allHabitsError}</Typography>;
  }

  if (showAllTasks) {
    return (
      <>
        {allHabitsStatus === "loading" ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Loading habits...
          </Typography>
        ) : filteredAndSortedAllTasks.length > 0 ? (
          <Stack
            direction="column"
            spacing={2}
            sx={{
              p: 2,
            }}
          >
            {filteredAndSortedAllTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            No habits match the current filter. Create a habit!
          </Typography>
        )}
      </>
    );
  }

  if (error) {
    return <Typography>Error fetching habits: {error}</Typography>;
  }

  const isLoading = status === "loading";

  return (
    <>
      {isLoading ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          Loading habits...
        </Typography>
      ) : filteredAndSortedTasksToday.length > 0 ? (
        <Stack
          direction="column"
          spacing={2}
          sx={{
            p: 2,
          }}
        >
          {filteredAndSortedTasksToday.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No habits left to complete today or no habits match the current
          filter.
        </Typography>
      )}

      {filteredAndSortedCompletedTasks.length > 0 && (
        <AccordionTasks
          tasks={filteredAndSortedCompletedTasks}
          accordion_title={"Completed"}
        ></AccordionTasks>
      )}

      {filteredAndSortedSkippedTasks.length > 0 && (
        <AccordionTasks
          tasks={filteredAndSortedSkippedTasks}
          accordion_title={"Skipped"}
        ></AccordionTasks>
      )}

      {filteredAndSortedFailedTasks.length > 0 && (
        <AccordionTasks
          tasks={filteredAndSortedFailedTasks}
          accordion_title={"Failed"}
        ></AccordionTasks>
      )}
    </>
  );
}
