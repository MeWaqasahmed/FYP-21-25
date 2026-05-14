import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Menu, MenuItem, Box, useMediaQuery, useTheme } from '@mui/material';
import { Bell, Menu as MenuIcon, LogOut, User, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authSlice';
import { useUIStore } from '../../store/uiSlice';
import { useQuery } from '@tanstack/react-query';
import { notificationsAPI } from '../../api/notifications';

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, clearAuth } = useAuthStore();
  const { setSidebarOpen } = useUIStore();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsAPI.get({ unreadOnly: true, limit: 5 }),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCount = notificationsData?.data?.data?.unreadCount || 0;
  const notifications = notificationsData?.data?.data?.notifications || [];

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(15, 15, 19, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2e2e45',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon size={24} />
          </IconButton>
        )}

        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {title}
        </Typography>

        {/* Notification Bell */}
        <IconButton
          color="inherit"
          onClick={(e) => setNotifAnchorEl(e.currentTarget)}
          sx={{ mr: 1 }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Bell size={20} />
          </Badge>
        </IconButton>

        {/* User Avatar */}
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ p: 0 }}
        >
          <Avatar
            src={user?.avatar}
            alt={user?.name}
            sx={{ width: 36, height: 36 }}
          >
            {user?.name?.charAt(0)}
          </Avatar>
        </IconButton>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={() => setNotifAnchorEl(null)}
          PaperProps={{
            sx: {
              width: 320,
              maxHeight: 400,
              bgcolor: '#1a1a24',
              border: '1px solid #2e2e45',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #2e2e45' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
          </Box>
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setNotifAnchorEl(null);
                  // Mark as read logic here
                }}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  py: 1.5,
                  borderBottom: '1px solid #2e2e45',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {notif.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notif.message}
                </Typography>
              </MenuItem>
            ))
          )}
        </Menu>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              width: 200,
              bgcolor: '#1a1a24',
              border: '1px solid #2e2e45',
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #2e2e45' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate('/settings');
            }}
          >
            <Settings size={18} style={{ marginRight: 12 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogOut size={18} style={{ marginRight: 12 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
