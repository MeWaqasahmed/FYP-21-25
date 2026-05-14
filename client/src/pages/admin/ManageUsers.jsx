import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Switch, Card, CardContent } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin';
import { useTitle } from '../../hooks/useTitle';
import { formatDate } from '../../utils/formatDate';
import PageWrapper from '../../components/layout/PageWrapper';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  useTitle('Manage Users');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminAPI.getUsers(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminAPI.updateUserStatus(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      toast.success('User status updated');
    },
    onError: () => {
      toast.error('Failed to update user status');
    },
  });

  const users = data?.data?.data?.users || [];

  if (isLoading) {
    return (
      <PageWrapper title="Manage Users">
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Manage Users">
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Manage Users
        </Typography>

        <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Active</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          color={user.role === 'admin' ? 'error' : 'primary'}
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.isVerified ? 'Verified' : 'Unverified'}
                          size="small"
                          color={user.isVerified ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={user.isActive}
                          onChange={(e) =>
                            updateStatusMutation.mutate({
                              id: user._id,
                              isActive: e.target.checked,
                            })
                          }
                          disabled={user.role === 'admin'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </PageWrapper>
  );
}
