import { Box, CircularProgress } from '@mui/material';

export default function Loader({ size = 40 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
}
