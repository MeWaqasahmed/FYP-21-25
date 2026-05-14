import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { formatNumber } from '../../utils/formatCurrency';

export default function TopProductsTable({ products = [] }) {
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
      sx={{
        border: '1px solid #2e2e45',
        borderRadius: 3,
        background: 'linear-gradient(145deg, #1a1a24 0%, #252535 100%)',
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Top Products
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Product</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Category</TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Clicks
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product._id || index}>
                  <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{
                        bgcolor: getCategoryColor(product.category),
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {formatNumber(product.clickCount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
