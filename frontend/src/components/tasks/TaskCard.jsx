import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDropDownIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { deleteTask } from "../../features/tasksSlice";

export default function TaskCard({ task }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <Typography>{task.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{task.description}</Typography>
        <Button onClick={handleDelete}>Delete</Button>
      </AccordionDetails>
    </Accordion>
  );
}
