import { useAuthStore } from '../store/authSlice';
import { authAPI } from '../api/auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const { token, user } = response.data.data;
      setAuth(user, token);
      localStorage.setItem('token', token);
      toast.success('Login successful!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  const logout = () => {
    clearAuth();
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
