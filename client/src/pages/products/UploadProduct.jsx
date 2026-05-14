import { useState } from 'react';
import { Box, Typography, TextField, MenuItem, Card, CardContent, Grid, IconButton } from '@mui/material';
import { X, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../../utils/validators';
import { useStore } from '../../hooks/useStore';
import { useTitle } from '../../hooks/useTitle';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { aiAPI } from '../../api/ai';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import AIContentPanel from '../../components/ai/AIContentPanel';
import toast from 'react-hot-toast';

const categories = ['Fashion', 'Tech', 'Beauty', 'Health', 'Food', 'Lifestyle', 'Travel', 'Sports', 'Other'];

export default function UploadProduct() {
  useTitle('Upload Product');
  const navigate = useNavigate();
  const { uploadProduct, isUploadingProduct } = useStore();
  const [images, setImages] = useState([]);
  const [aiContent, setAiContent] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const productName = watch('name');
  const productCategory = watch('category');

  const generateAIMutation = useMutation({
    mutationFn: aiAPI.generate,
    onSuccess: (response) => {
      setAiContent(response.data.data.content);
      toast.success('AI content generated!');
    },
    onError: () => {
      toast.error('Failed to generate AI content');
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('referralUrl', data.referralUrl);
    if (data.price) formData.append('price', data.price);
    if (data.displayPrice) formData.append('displayPrice', data.displayPrice);
    if (aiContent?.seoDescription) formData.append('seoDescription', aiContent.seoDescription);
    if (aiContent?.hashtags) formData.append('hashtags', JSON.stringify(aiContent.hashtags));

    images.forEach((image) => {
      formData.append('images', image);
    });

    uploadProduct(formData);
    navigate('/products');
  };

  const handleGenerateAI = () => {
    if (!productName || !productCategory) {
      toast.error('Please enter product name and category first');
      return;
    }
    generateAIMutation.mutate({
      name: productName,
      category: productCategory,
      targetAudience: 'General audience',
    });
  };

  return (
    <PageWrapper title="Upload Product">
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Upload Product
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Add a new product to your store
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Product Details
                  </Typography>

                  <TextField
                    fullWidth
                    label="Product Name"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    select
                    label="Category"
                    {...register('category')}
                    error={!!errors.category}
                    helperText={errors.category?.message}
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
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Referral URL"
                    {...register('referralUrl')}
                    error={!!errors.referralUrl}
                    helperText={errors.referralUrl?.message}
                    sx={{ mb: 2 }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Price (optional)"
                        type="number"
                        {...register('price', { valueAsNumber: true })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Display Price (optional)"
                        {...register('displayPrice')}
                        placeholder="$99.99"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Product Images
                  </Typography>

                  <Box
                    sx={{
                      border: '2px dashed #2e2e45',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { borderColor: 'primary.main' },
                      mb: 2,
                    }}
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <Upload size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="body2" color="text.secondary">
                      Click to upload images (max 5)
                    </Typography>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    {images.map((image, index) => (
                      <Grid item xs={6} key={index}>
                        <Box sx={{ position: 'relative' }}>
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            style={{
                              width: '100%',
                              height: 120,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'error.main',
                              color: '#fff',
                              '&:hover': { bgcolor: 'error.dark' },
                            }}
                          >
                            <X size={16} />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3, mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      AI Generated Content
                    </Typography>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handleGenerateAI}
                      disabled={generateAIMutation.isPending}
                    >
                      {generateAIMutation.isPending ? 'Generating...' : 'Generate'}
                    </Button>
                  </Box>

                  {aiContent ? (
                    <AIContentPanel content={aiContent} />
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Click "Generate" to create AI-powered content
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="primary"
              disabled={isUploadingProduct || images.length === 0}
            >
              {isUploadingProduct ? 'Uploading...' : 'Upload Product'}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/products')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </PageWrapper>
  );
}
