import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function PageWrapper({ title, children }) {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <Navbar title={title} />
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 3,
            '@media (max-width: 768px)': {
              p: 2,
              pb: 10, // Space for bottom nav on mobile
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
