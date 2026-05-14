import { Box, Chip } from '@mui/material';

export default function HashtagChips({ hashtags = [] }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {hashtags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          size="small"
          sx={{
            bgcolor: 'rgba(99, 102, 241, 0.12)',
            color: '#a5b4fc',
            fontWeight: 500,
            borderRadius: '999px',
          }}
        />
      ))}
    </Box>
  );
}
