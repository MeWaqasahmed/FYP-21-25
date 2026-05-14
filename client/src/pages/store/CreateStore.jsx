import { useState } from 'react';
import { Box, Typography, TextField, Stepper, Step, StepLabel, Card, CardContent, Grid, Chip } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { storeSchema } from '../../utils/validators';
import { useStore } from '../../hooks/useStore';
import { useTitle } from '../../hooks/useTitle';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';

const steps = ['Basic Info', 'Branding', 'Theme'];

const categories = ['Fashion', 'Tech', 'Beauty', 'Health', 'Food', 'Lifestyle', 'Travel', 'Sports'];

export default function CreateStore() {
  useTitle('Create Store');
  const navigate = useNavigate();
  const { createStore, isCreatingStore } = useStore();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [theme, setTheme] = useState({
    primaryColor: '#6366f1',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(storeSchema),
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid && activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const onSubmit = (data) => {
    createStore({
      ...data,
      categories: selectedCategories,
      theme,
    });
    navigate('/dashboard');
  };

  return (
    <PageWrapper title="Create Store">
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Create Your Store
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Set up your branded storefront in just a few steps
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {activeStep === 0 && (
                <Box>
                  <TextField
                    fullWidth
                    label="Store Name"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Store Username"
                    {...register('username')}
                    error={!!errors.username}
                    helperText={errors.username?.message || 'This will be your store URL: /store/username'}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Description"
                    {...register('description')}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    multiline
                    rows={4}
                  />
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Select Categories
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                    {categories.map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => toggleCategory(category)}
                        color={selectedCategories.includes(category) ? 'primary' : 'default'}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Selected: {selectedCategories.length} categories
                  </Typography>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Customize Theme
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Primary Color
                      </Typography>
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                        style={{ width: '100%', height: 48, cursor: 'pointer', borderRadius: 8 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Accent Color
                      </Typography>
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                        style={{ width: '100%', height: 48, cursor: 'pointer', borderRadius: 8 }}
                      />
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      borderRadius: 2,
                      bgcolor: theme.primaryColor,
                      color: '#fff',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6">Preview</Typography>
                    <Typography variant="body2">This is how your store will look</Typography>
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isCreatingStore}
                  >
                    {isCreatingStore ? 'Creating...' : 'Create Store'}
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleNext}>
                    Next
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </PageWrapper>
  );
}
