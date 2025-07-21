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
import GroupIcon from "@mui/icons-material/Group";

// Formatting for the popups when hovering over an icon
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} placement="right" classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "black",
    fontSize: 18,
  },
}));

export default function HUD() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const iconStyle = { color: "white", fontSize: 40 };
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
            navigate("/habits");
          }}
        >
          <HabitsIcon sx={iconStyle} />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Marketplace">
        <IconButton
          onClick={() => {
            navigate("/marketplace");
          }}
        >
          <MarketplaceIcon sx={iconStyle} />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Edit Room">
        <IconButton
          onClick={() => {
            navigate("/edit");
          }}
        >
          <EditRoomIcon sx={iconStyle} />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Timer">
        <IconButton
          onClick={() => {
            dispatch(openTimer());
          }}
        >
          <TimerIcon sx={iconStyle} />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip title="Friends">
        <IconButton
          onClick={() => {
            navigate("/friends");
          }}
        >
          <GroupIcon sx={iconStyle} />
        </IconButton>
      </CustomTooltip>
    </Stack>
  );
}
