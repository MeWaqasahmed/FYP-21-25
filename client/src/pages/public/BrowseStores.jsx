import { useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, TextField, InputAdornment } from '@mui/material';
import { Search, Store as StoreIcon, MousePointerClick } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { storeAPI } from '../../api/store';
import { useTitle } from '../../hooks/useTitle';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../utils/formatCurrency';
import Loader from '../../components/common/Loader';

export default function BrowseStores() {
  useTitle('Browse Stores');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['browse-stores', search],
    queryFn: () => storeAPI.browse({ search }),
  });

  const stores = data?.data?.data?.stores || [];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
          Discover Stores
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
          Browse curated storefronts from top influencers
        </Typography>

        {/* Search */}
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}>
          <TextField
            fullWidth
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Stores Grid */}
        {isLoading ? (
          <Loader />
        ) : (
          <Grid container spacing={3}>
            {stores.map((store) => (
              <Grid item xs={12} sm={6} md={4} key={store._id}>
                <Card
                  onClick={() => navigate(`/store/${store.username}`)}
                  sx={{
                    border: '1px solid #2e2e45',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={store.logo}
                        alt={store.name}
                        sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
                      >
                        {store.name?.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {store.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{store.username}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {store.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StoreIcon size={16} color="#94a3b8" />
                        <Typography variant="body2" color="text.secondary">
                          {store.totalProducts} products
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MousePointerClick size={16} color="#94a3b8" />
                        <Typography variant="body2" color="text.secondary">
                          {formatNumber(store.totalClicks)} clicks
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
