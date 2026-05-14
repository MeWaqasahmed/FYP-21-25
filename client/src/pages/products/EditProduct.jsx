import { useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Card, CardContent } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../../api/products';
import { useStore } from '../../hooks/useStore';
import { useTitle } from '../../hooks/useTitle';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const categories = ['Fashion', 'Tech', 'Beauty', 'Health', 'Food', 'Lifestyle', 'Travel', 'Sports', 'Other'];

export default function EditProduct() {
  useTitle('Edit Product');
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct, deleteProduct } = useStore();

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.get(id),
  });

  const product = data?.data?.data?.product;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (product) {
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('category', product.category);
      setValue('referralUrl', product.referralUrl);
      setValue('price', product.price);
      setValue('displayPrice', product.displayPrice);
    }
  }, [product, setValue]);

  const onSubmit = (data) => {
    updateProduct({ id, data });
    navigate('/products');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      navigate('/products');
    }
  };

  if (isLoading) {
    return (
      <PageWrapper title="Edit Product">
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Edit Product">
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Edit Product
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Update product information
        </Typography>

        <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Product Name"
                {...register('name', { required: 'Product name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                select
                label="Category"
                {...register('category')}
                sx={{ mb: 2 }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Description"
                {...register('description')}
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Referral URL"
                {...register('referralUrl')}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Button variant="ghost" onClick={() => navigate('/products')}>
                  Cancel
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="danger" onClick={handleDelete}>
                  Delete Product
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </PageWrapper>
  );
}
