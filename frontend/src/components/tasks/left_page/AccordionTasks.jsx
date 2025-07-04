import { useState } from "react";
import Stack from "@mui/material/Stack";
import TaskCard from "./TaskCard";
import { Typography } from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function AccordionTasks({ tasks, accordion_title }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };
  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{
        m: 2,
        borderRadius: 3,
        boxShadow: "none",
        bgcolor: "transparent",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          bgcolor: "transparent",
          color: "text.primary",
          borderRadius: 3,
          minHeight: "48px",

          flexDirection: "row-reverse", // enables iconWrapper then title of accordion

          "& .MuiAccordionSummary-expandIconWrapper": {
            marginRight: 1, // Add space to the right of the icon (between icon and text)
            transform: "rotate(-90deg)", // rotate to make expand icon point right when collapsed
            transition: "transform 0.3s ease-in-out",
            "&.Mui-expanded": {
              transform: "rotate(0deg)",
            },
          },
        }}
      >
        <Typography variant="h6">{accordion_title}</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          p: 0, // Remove default padding for AccordionDetails
          bgcolor: "transparent",
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          sx={{
            p: 2, // Add padding inside the Stack for content spacing
          }}
        >
          {tasks &&
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                task_status={accordion_title}
              />
            ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
