import { Box, Card, CardContent, Typography, TextField, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validators';
import { useAuth } from '../../hooks/useAuth';
import { useTitle } from '../../hooks/useTitle';
import Button from '../../components/common/Button';

export default function Register() {
  useTitle('Register');
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          border: '1px solid #2e2e45',
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Start your influencer journey today
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Full Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Username"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isRegistering}
              sx={{ mb: 2, height: 48 }}
            >
              {isRegistering ? 'Creating account...' : 'Create Account'}
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <MuiLink
                component={Link}
                to="/login"
                sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}
              >
                Sign in
              </MuiLink>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
