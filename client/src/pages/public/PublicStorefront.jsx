import { useState } from 'react';
import { Box, Typography, Container, Grid, Chip, Avatar, IconButton } from '@mui/material';
import { Instagram, Facebook, ExternalLink } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { storeAPI } from '../../api/store';
import { trackAPI } from '../../api/track';
import { useTitle } from '../../hooks/useTitle';
import ProductCard from '../../components/common/ProductCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

export default function PublicStorefront() {
  const { username } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data, isLoading } = useQuery({
    queryKey: ['public-store', username],
    queryFn: () => storeAPI.getPublic(username),
  });

  const trackClickMutation = useMutation({
    mutationFn: trackAPI.click,
  });

  const store = data?.data?.data?.store;
  const products = data?.data?.data?.products || [];

  useTitle(store?.name || 'Store');

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleVisitProduct = (product) => {
    trackClickMutation.mutate(product._id);
    window.open(product.referralUrl, '_blank');
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader />
      </Box>
    );
  }

  if (!store) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5">Store not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Banner */}
      <Box
        sx={{
          height: 300,
          background: store.bannerImage
            ? `url(${store.bannerImage})`
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      />

      {/* Store Info */}
      <Container maxWidth="lg">
        <Box sx={{ position: 'relative', mt: -8, mb: 4 }}>
          <Avatar
            src={store.logo}
            alt={store.name}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid',
              borderColor: 'background.default',
              bgcolor: 'primary.main',
              fontSize: '2rem',
            }}
          >
            {store.name?.charAt(0)}
          </Avatar>

          <Typography variant="h3" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
            {store.name}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {store.description}
          </Typography>

          {/* Social Links */}
          {store.owner?.socialLinks && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {store.owner.socialLinks.instagram && (
                <IconButton
                  size="small"
                  onClick={() => window.open(`https://instagram.com/${store.owner.socialLinks.instagram}`, '_blank')}
                >
                  <Instagram size={20} />
                </IconButton>
              )}
              {store.owner.socialLinks.facebook && (
                <IconButton
                  size="small"
                  onClick={() => window.open(`https://facebook.com/${store.owner.socialLinks.facebook}`, '_blank')}
                >
                  <Facebook size={20} />
                </IconButton>
              )}
            </Box>
          )}
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3} sx={{ pb: 8 }}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Box onClick={() => handleProductClick(product)}>
                <ProductCard product={product} />
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Powered By */}
        <Box sx={{ py: 4, textAlign: 'center', borderTop: '1px solid #2e2e45' }}>
          <Typography variant="body2" color="text.secondary">
            Powered by <strong>Influencer Platform</strong>
          </Typography>
        </Box>
      </Container>

      {/* Product Modal */}
      <Modal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name}
        maxWidth="md"
      >
        {selectedProduct && (
          <Box>
            <Box
              component="img"
              src={selectedProduct.images?.[0]}
              alt={selectedProduct.name}
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 3,
              }}
            />

            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedProduct.description}
            </Typography>

            {selectedProduct.displayPrice && (
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                {selectedProduct.displayPrice}
              </Typography>
            )}

            <Button
              variant="primary"
              fullWidth
              endIcon={<ExternalLink size={20} />}
              onClick={() => handleVisitProduct(selectedProduct)}
              sx={{ height: 48 }}
            >
              Visit Product
            </Button>
          </Box>
        )}
      </Modal>
    </Box>
  );
}
