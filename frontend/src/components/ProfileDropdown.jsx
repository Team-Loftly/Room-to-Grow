import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    console.log(`Action: ${action}`);
    handleClose();
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    handleClose();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="relative">
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <AccountCircle fontSize="large" className="text-3xl mr-2" />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
        className="mt-2"
      >
        {/* <MenuItem
          disabled
          className="px-4 py-2 text-gray-700 font-semibold border-b border-gray-200"
        >
          <span className="truncate">user@example.com</span>
        </MenuItem> */}

        {/* <MenuItem
          onClick={() => handleMenuItemClick("My Profile")}
          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-2 my-1"
        >
          <PersonIcon className="mr-2 text-blue-500" /> My Profile
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("Dashboard")}
          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-2 my-1"
        >
          <DashboardIcon className="mr-2 text-green-500" /> Dashboard
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("Settings")}
          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-2 my-1"
        >
          <SettingsIcon className="mr-2 text-purple-500" /> Settings
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("Help")}
          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-2 my-1"
        >
          <HelpOutlineIcon className="mr-2 text-yellow-500" /> Help
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("Feedback")}
          className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-2 my-1"
        >
          <FeedbackIcon className="mr-2 text-orange-500" /> Send Feedback
        </MenuItem>

        <div className="border-t border-gray-200 my-1 mx-2"></div> */}

        <MenuItem
          onClick={logoutUser}
          className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-md mx-2 my-1 font-semibold"
        >
          <ExitToAppIcon className="mr-2" /> Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
