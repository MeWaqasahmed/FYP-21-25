import { useState } from 'react';
import { Box, Typography, TextField, MenuItem, Card, CardContent, Grid, Skeleton } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { aiAPI } from '../../api/ai';
import { useTitle } from '../../hooks/useTitle';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import AIContentPanel from '../../components/ai/AIContentPanel';
import toast from 'react-hot-toast';

const categories = ['Fashion', 'Tech', 'Beauty', 'Health', 'Food', 'Lifestyle', 'Travel', 'Sports', 'Other'];

export default function AITools() {
  useTitle('AI Tools');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    targetAudience: '',
  });
  const [generatedContent, setGeneratedContent] = useState(null);

  const generateMutation = useMutation({
    mutationFn: aiAPI.generate,
    onSuccess: (response) => {
      setGeneratedContent(response.data.data.content);
      toast.success('Content generated successfully!');
    },
    onError: () => {
      toast.error('Failed to generate content');
    },
  });

  const handleGenerate = () => {
    if (!formData.name || !formData.category) {
      toast.error('Please fill in product name and category');
      return;
    }
    generateMutation.mutate(formData);
  };

  return (
    <PageWrapper title="AI Tools">
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          AI Content Generator
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Generate SEO-optimized content and social media captions with AI
        </Typography>

        <Grid container spacing={3}>
          {/* Input Form */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                border: '1px solid #2e2e45',
                borderRadius: 3,
                position: 'sticky',
                top: 80,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Product Information
                </Typography>

                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  label="Target Audience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g., Tech enthusiasts, Fashion lovers"
                  multiline
                  rows={3}
                  sx={{ mb: 3 }}
                />

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  sx={{ height: 48 }}
                >
                  {generateMutation.isPending ? 'Generating...' : 'Generate Content'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Generated Output */}
          <Grid item xs={12} md={7}>
            <Card
              sx={{
                border: '1px solid #2e2e45',
                borderRadius: 3,
                minHeight: 600,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Generated Content
                </Typography>

                {generateMutation.isPending ? (
                  <Box>
                    <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                  </Box>
                ) : generatedContent ? (
                  <AIContentPanel content={generatedContent} />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 400,
                      textAlign: 'center',
                    }}
                  >
                    <Box>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No content generated yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Fill in the form and click "Generate Content" to get started
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageWrapper>
  );
}
