import { useEffect } from 'react';
import { Box, Typography, TextField, Card, CardContent, Switch, FormControlLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useStore } from '../../hooks/useStore';
import { useTitle } from '../../hooks/useTitle';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

export default function EditStore() {
  useTitle('Edit Store');
  const { store, isLoadingStore, updateStore, isUpdatingStore } = useStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const isPublished = watch('isPublished');

  useEffect(() => {
    if (store) {
      setValue('name', store.name);
      setValue('description', store.description);
      setValue('isPublished', store.isPublished);
    }
  }, [store, setValue]);

  const onSubmit = (data) => {
    updateStore(data);
  };

  if (isLoadingStore) {
    return (
      <PageWrapper title="Edit Store">
        <Loader />
      </PageWrapper>
    );
  }

  if (!store) {
    return (
      <PageWrapper title="Edit Store">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No store found
          </Typography>
          <Button variant="primary" href="/store/create">
            Create Store
          </Button>
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Edit Store">
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Edit Store
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Update your store information
        </Typography>

        <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Store Name"
                {...register('name', { required: 'Store name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Description"
                {...register('description')}
                multiline
                rows={4}
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    {...register('isPublished')}
                    checked={isPublished}
                    onChange={(e) => setValue('isPublished', e.target.checked)}
                  />
                }
                label="Publish Store (make it visible to public)"
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isUpdatingStore}
                >
                  {isUpdatingStore ? 'Saving...' : 'Save Changes'}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => window.open(`/store/${store.username}`, '_blank')}
                >
                  Preview Store
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </PageWrapper>
  );
}
