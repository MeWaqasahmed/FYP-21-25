import { useState } from 'react';
import { Box, Typography, Grid, TextField, MenuItem, InputAdornment } from '@mui/material';
import { Search, Plus, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import { useTitle } from '../../hooks/useTitle';
import PageWrapper from '../../components/layout/PageWrapper';
import ProductCard from '../../components/common/ProductCard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const categories = ['All', 'Fashion', 'Tech', 'Beauty', 'Health', 'Food', 'Lifestyle', 'Travel', 'Sports'];

export default function ProductList() {
  useTitle('Products');
  const navigate = useNavigate();
  const { products, isLoadingProducts } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (isLoadingProducts) {
    return (
      <PageWrapper title="Products">
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Products">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Products
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your product listings
            </Typography>
          </Box>
          <Button
            variant="primary"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/products/upload')}
          >
            Upload Product
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />

          <TextField
            select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            message={
              products.length === 0
                ? 'Start by uploading your first product'
                : 'Try adjusting your filters'
            }
            action={products.length === 0 ? 'Upload Product' : undefined}
            onAction={products.length === 0 ? () => navigate('/products/upload') : undefined}
          />
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard
                  product={product}
                  onEdit={(p) => navigate(`/products/edit/${p._id}`)}
                  onShare={(p) => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/store/${p.store?.username || 'store'}`
                    );
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </PageWrapper>
  );
}
