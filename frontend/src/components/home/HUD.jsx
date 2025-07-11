import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openTimer } from "../../features/timerSlice";
import { Stack, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import HabitsIcon from "@mui/icons-material/ChecklistRtl";
import MarketplaceIcon from "@mui/icons-material/Storefront";
import EditRoomIcon from "@mui/icons-material/Construction";
import TimerIcon from "@mui/icons-material/AccessAlarm";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} placement="right" classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "black",
    fontSize: 18,
    fontFamily: "Be Vietnam Pro",
    fontWeight: 300,
  },
}));

export default function HUD() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Stack
      spacing={4}
      sx={{
        justifyContent: "center",
        ml: 6,
      }}
    >
      <CustomTooltip title="Habits">
        <IconButton
          onClick={() => {
            navigate("/tasks");
          }}
        >
          <HabitsIcon sx={{ color: "white", fontSize: 40 }} />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Marketplace">
        <IconButton
          onClick={() => {
            navigate("/marketplace");
          }}
        >
          <MarketplaceIcon sx={{ color: "white", fontSize: 40 }} />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Edit Room">
        <IconButton
          onClick={() => {
            navigate("/edit");
          }}
        >
          <EditRoomIcon sx={{ color: "white", fontSize: 40 }} />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Timer">
        <IconButton
          onClick={() => {
            dispatch(openTimer());
          }}
        >
          <TimerIcon sx={{ color: "white", fontSize: 40 }} />
        </IconButton>
      </CustomTooltip>
    </Stack>
  );
}
