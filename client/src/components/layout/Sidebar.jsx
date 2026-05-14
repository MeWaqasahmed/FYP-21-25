import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, Chip, IconButton, useMediaQuery, useTheme } from '@mui/material';
import {
  LayoutDashboard,
  Store,
  Package,
  BarChart2,
  Sparkles,
  Crown,
  Settings,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authSlice';
import { useUIStore } from '../../store/uiSlice';
import { useQuery } from '@tanstack/react-query';
import { subscriptionAPI } from '../../api/subscription';

const SIDEBAR_WIDTH = 240;

const influencerNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'My Store', icon: Store, path: '/store/edit' },
  { label: 'Products', icon: Package, path: '/products' },
  { label: 'Analytics', icon: BarChart2, path: '/analytics' },
  { label: 'AI Tools', icon: Sparkles, path: '/ai-tools' },
  { label: 'Subscription', icon: Crown, path: '/subscription' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

const adminNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Manage Users', icon: Users, path: '/admin/users' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionAPI.getMy(),
    enabled: user?.role === 'influencer',
  });

  const subscription = subscriptionData?.data?.data?.subscription;
  const navItems = user?.role === 'admin' ? adminNavItems : influencerNavItems;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'premium':
        return '#f59e0b';
      case 'pro':
        return '#6366f1';
      default:
        return '#64748b';
    }
  };

  const SidebarContent = () => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1a1a24',
        borderRight: '1px solid #2e2e45',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
          {isTablet && !isMobile ? 'IP' : 'Influencer Platform'}
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setSidebarOpen(false)} size="small">
            <X size={20} />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, px: 2 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setSidebarOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  position: 'relative',
                  pl: isTablet && !isMobile ? 1.5 : 2,
                  '&::before': active
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: '60%',
                        bgcolor: 'primary.main',
                        borderRadius: '0 4px 4px 0',
                      }
                    : {},
                  bgcolor: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  '&:hover': {
                    bgcolor: active ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: isTablet && !isMobile ? 40 : 48, color: active ? 'primary.main' : 'text.secondary' }}>
                  <Icon size={20} />
                </ListItemIcon>
                {(!isTablet || isMobile) && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                      color: active ? 'text.primary' : 'text.secondary',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Section */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #2e2e45',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          src={user?.avatar}
          alt={user?.name}
          sx={{ width: 40, height: 40 }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        {(!isTablet || isMobile) && (
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </Typography>
            {subscription && (
              <Chip
                label={subscription.plan.toUpperCase()}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: getPlanColor(subscription.plan),
                  color: '#fff',
                  mt: 0.5,
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: isTablet ? 80 : SIDEBAR_WIDTH,
        flexShrink: 0,
        transition: 'width 0.2s ease',
      }}
    >
      <SidebarContent />
    </Box>
  );
}
