import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Tooltip,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckIcon from '@mui/icons-material/Check';

import { setFilterBy } from '../../../features/sortFilterSlice';

export default function FilterButton() {
  const dispatch = useDispatch();
  const currentFilterBy = useSelector((state) => state.sortFilter.filterBy);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const [selectedFilterBy, setSelectedFilterBy] = React.useState(currentFilterBy);

  React.useEffect(() => {
    setSelectedFilterBy(currentFilterBy);
  }, [currentFilterBy]);


  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (option) => {
    setSelectedFilterBy(option);
    dispatch(setFilterBy(option));
    handleMenuClose();
  };

  return (
    <>
      <Tooltip title="Filter">
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
          <FilterListIcon />
        </Button>
      </Tooltip>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        <Typography variant="overline" sx={{ px: 2, pt: 1, display: 'block' }}>
            Filter By
        </Typography>
        <MenuItem onClick={() => handleFilterSelect('default')}>
          <ListItemIcon>
            {selectedFilterBy === 'default' && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>All</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('high')}>
          <ListItemIcon>
            {selectedFilterBy === 'high' && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>High Priority</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('medium')}>
          <ListItemIcon>
            {selectedFilterBy === 'medium' && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>Medium Priority</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('low')}>
          <ListItemIcon>
            {selectedFilterBy === 'low' && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <Typography variant="inherit" noWrap>Low Priority</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}