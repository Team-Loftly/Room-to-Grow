import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
  Box,
  Tooltip
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckIcon from '@mui/icons-material/Check';
import { setSortOptions } from '../../../features/sortFilterSlice';


export default function SortButton() {
  const dispatch = useDispatch();
  const currentSortBy = useSelector((state) => state.sortFilter.sortBy);
  const currentSortDirection = useSelector((state) => state.sortFilter.sortDirection);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const [selectedSortBy, setSelectedSortBy] = React.useState(currentSortBy);
  const [selectedSortDirection, setSelectedSortDirection] = React.useState(currentSortDirection);

  React.useEffect(() => {
    setSelectedSortBy(currentSortBy);
    setSelectedSortDirection(currentSortDirection);
  }, [currentSortBy, currentSortDirection]);


  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSortBySelect = (option) => {
    setSelectedSortBy(option);
  };

  const toggleSortDirection = () => {
    setSelectedSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSaveSort = () => {
    dispatch(setSortOptions({
      sortBy: selectedSortBy,
      sortDirection: selectedSortDirection,
    }));
    handleMenuClose();
  };

  return (
    <>
    <Tooltip title="Sort">
      <Button
        variant="outlined"
        onClick={handleMenuClick}
        sx={{
          color: "black",
          borderColor: "black",
          "&:hover": {
            borderColor: "black",
            color: "black",
          },
          mr: 2,
        }}
      >
        <SwapVertIcon />
      </Button>
    </Tooltip>
      <Menu
        id="sort-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        <Typography variant="overline" sx={{ px: 2, pt: 1, display: 'block' }}>
            Sort By
        </Typography>
        <MenuItem onClick={() => handleSortBySelect('default')}>
          <ListItemIcon>
            {selectedSortBy === 'default' && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>Default</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSortBySelect('name')}>
          <ListItemIcon>
            {selectedSortBy === 'name' && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>Name</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleSortBySelect('priority')}>
          <ListItemIcon>
            {selectedSortBy === 'priority' && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>Priority</Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <Typography variant="overline" sx={{ px: 2, display: 'block' }}>
            Direction
        </Typography>
        <MenuItem onClick={toggleSortDirection}>
          <ListItemIcon>
            {selectedSortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            {selectedSortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ p: 1, textAlign: 'right' }}>
            <Button
                variant="contained"
                onClick={handleSaveSort}
                size="small"
                sx={{ ml: 'auto' }}
            >
                Save
            </Button>
        </Box>
      </Menu>
    </>
  );
}