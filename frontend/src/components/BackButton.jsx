import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function BackButton(props) {
  const navigate = useNavigate();

  return (
    <Typography
      className="hover:cursor-pointer"
      variant="h7"
      onClick={() => navigate(-1)}
      sx={{
        position: "absolute",
        left: 0,
        top: "40%",
        zIndex: 5,
        p: 5,
        color: "white",
        fontSize: 20,
        ...props.sx,
      }}
    >
      <ArrowBackIosNewIcon />
    </Typography>
  );
}
