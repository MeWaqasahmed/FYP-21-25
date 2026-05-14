import { useState } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Card, CardContent, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../../api/auth';
import { useAuthStore } from '../../store/authSlice';
import { useTitle } from '../../hooks/useTitle';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfileSettings() {
  useTitle('Settings');
  const [tab, setTab] = useState(0);
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { register: registerProfile, handleSubmit: handleSubmitProfile } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
    },
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword } = useForm();

  const { register: registerSocial, handleSubmit: handleSubmitSocial } = useForm({
    defaultValues: {
      instagram: user?.socialLinks?.instagram || '',
      facebook: user?.socialLinks?.facebook || '',
      tiktok: user?.socialLinks?.tiktok || '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: (response) => {
      updateUser(response.data.data.user);
      queryClient.invalidateQueries(['user']);
      toast.success('Profile updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: () => {
      resetPassword();
      toast.success('Password updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update password');
    },
  });

  const onSubmitProfile = (data) => {
    updateProfileMutation.mutate(data);
  };

  const onSubmitPassword = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    updatePasswordMutation.mutate({ password: data.newPassword });
  };

  const onSubmitSocial = (data) => {
    updateProfileMutation.mutate({
      socialLinks: {
        instagram: data.instagram,
        facebook: data.facebook,
        tiktok: data.tiktok,
      },
    });
  };

  return (
    <PageWrapper title="Settings">
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Settings
        </Typography>

        <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3 }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            sx={{ borderBottom: '1px solid #2e2e45', px: 3 }}
          >
            <Tab label="Profile" />
            <Tab label="Security" />
            <Tab label="Social Links" />
          </Tabs>

          <CardContent sx={{ p: 4 }}>
            {/* Profile Tab */}
            <TabPanel value={tab} index={0}>
              <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...registerProfile('name')}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Bio"
                  {...registerProfile('bio')}
                  multiline
                  rows={4}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email}
                  disabled
                  helperText="Email cannot be changed"
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tab} index={1}>
              <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  {...registerPassword('newPassword')}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  {...registerPassword('confirmPassword')}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={updatePasswordMutation.isPending}
                >
                  {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </TabPanel>

            {/* Social Links Tab */}
            <TabPanel value={tab} index={2}>
              <form onSubmit={handleSubmitSocial(onSubmitSocial)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Instagram Username"
                      {...registerSocial('instagram')}
                      placeholder="@username"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Facebook Username"
                      {...registerSocial('facebook')}
                      placeholder="username"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="TikTok Username"
                      {...registerSocial('tiktok')}
                      placeholder="@username"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Social Links'}
                  </Button>
                </Box>
              </form>
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
    </PageWrapper>
  );
}
