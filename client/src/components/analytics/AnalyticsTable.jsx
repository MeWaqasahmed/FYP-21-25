import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ExternalLink, Copy } from 'lucide-react';
import { formatNumber } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function AnalyticsTable({ products = [] }) {
  const [orderBy, setOrderBy] = useState('clickCount');
  const [order, setOrder] = useState('desc');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[orderBy] || 0;
    const bValue = b[orderBy] || 0;
    return order === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const calculateConversion = (clicks, views) => {
    if (!views || views === 0) return 0;
    return ((clicks / views) * 100).toFixed(2);
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
          Product Performance
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleSort('name')}
                    sx={{ color: 'text.secondary', fontWeight: 600 }}
                  >
                    Product
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'clickCount'}
                    direction={orderBy === 'clickCount' ? order : 'asc'}
                    onClick={() => handleSort('clickCount')}
                    sx={{ color: 'text.secondary', fontWeight: 600 }}
                  >
                    Clicks
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'viewCount'}
                    direction={orderBy === 'viewCount' ? order : 'asc'}
                    onClick={() => handleSort('viewCount')}
                    sx={{ color: 'text.secondary', fontWeight: 600 }}
                  >
                    Views
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Conversion %
                </TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {formatNumber(product.clickCount)}
                  </TableCell>
                  <TableCell align="right">{formatNumber(product.viewCount)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                    {calculateConversion(product.clickCount, product.viewCount)}%
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Copy referral link">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(product.referralUrl)}
                      >
                        <Copy size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open referral link">
                      <IconButton
                        size="small"
                        onClick={() => window.open(product.referralUrl, '_blank')}
                      >
                        <ExternalLink size={16} />
                      </IconButton>
                    </Tooltip>
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
