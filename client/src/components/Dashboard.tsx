// Dashboard.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, logout } from './store';
import { Avatar, IconButton, Menu, MenuItem, Box, Typography, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 2 }}>
        <IconButton onClick={handleProfileClick}>
          <Avatar src={userInfo?.image} alt={userInfo?.name} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          <MenuItem onClick={handleClose}>Add Account</MenuItem>
        </Menu>
      </Box>

      <Card sx={{ padding: 4, marginBottom: 2 }}>
        <Typography variant="h6">Welcome, {userInfo?.name}</Typography>
      </Card>

      {/* Dashboard Cards */}
      <Box display="flex" gap={2}>
        <Card sx={{ flex: 1, padding: 2 }}>
          <Typography>Card 1</Typography>
        </Card>
        <Card sx={{ flex: 1, padding: 2 }}>
          <Typography>Card 2</Typography>
        </Card>
        <Card sx={{ flex: 1, padding: 2 }}>
          <Typography>Card 3</Typography>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
