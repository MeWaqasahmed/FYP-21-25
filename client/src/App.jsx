import { useEffect } from 'react';
import { useAuthStore } from './store/authSlice';
import AppRouter from './routes/AppRouter';

function App() {
  const { token } = useAuthStore();

  useEffect(() => {
    // Sync token with localStorage
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return <AppRouter />;
}

export default App;
