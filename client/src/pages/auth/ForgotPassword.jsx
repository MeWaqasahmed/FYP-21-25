import { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../api/auth';
import { useTitle } from '../../hooks/useTitle';
import Button from '../../components/common/Button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPassword() {
  useTitle('Forgot Password');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: authAPI.forgotPassword,
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
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
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Enter your email to receive a password reset link
          </Typography>

          {success ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              If an account exists with that email, you will receive a password reset link shortly.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={mutation.isPending}
                sx={{ mb: 2, height: 48 }}
              >
                {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={Link}
              to="/login"
              variant="ghost"
              sx={{ textDecoration: 'none' }}
            >
              Back to Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
