import { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Box, IconButton } from '@mui/material';
import { Edit, Share2, MousePointerClick } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../utils/formatCurrency';

export default function ProductCard({ product, onEdit, onShare }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      Fashion: '#ec4899',
      Tech: '#3b82f6',
      Beauty: '#f472b6',
      Health: '#22c55e',
      Food: '#f59e0b',
      Lifestyle: '#8b5cf6',
      Travel: '#06b6d4',
      Sports: '#ef4444',
      Other: '#64748b',
    };
    return colors[category] || colors.Other;
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid #2e2e45',
        transition: 'all 150ms ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        },
      }}
      onClick={() => navigate(`/products/edit/${product._id}`)}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: '#252535' }}>
        <CardMedia
          component="img"
          image={product.images?.[0] || 'https://via.placeholder.com/800x450'}
          alt={product.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {/* Category Chip */}
        <Chip
          label={product.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: getCategoryColor(product.category),
            color: '#fff',
            fontWeight: 600,
            fontSize: 11,
          }}
        />

        {/* Hover Overlay */}
        {isHovered && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(product);
              }}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <Edit size={20} />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(product);
              }}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <Share2 size={20} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <MousePointerClick size={16} />
          <Typography variant="body2">
            {formatNumber(product.clickCount)} clicks
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
