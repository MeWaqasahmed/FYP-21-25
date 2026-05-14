import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../api/analytics';

export const useAnalytics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  });

  const summaryQuery = useQuery({
    queryKey: ['analytics-summary', dateRange],
    queryFn: () => analyticsAPI.getSummary(dateRange),
  });

  const clicksQuery = useQuery({
    queryKey: ['analytics-clicks', dateRange],
    queryFn: () => analyticsAPI.getClicks(dateRange),
  });

  const productsQuery = useQuery({
    queryKey: ['analytics-products', dateRange],
    queryFn: () => analyticsAPI.getProducts(dateRange),
  });

  const setRange = (days) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setDateRange({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  };

  return {
    summary: summaryQuery.data?.data?.data,
    clicks: clicksQuery.data?.data?.data?.clicksData || [],
    products: productsQuery.data?.data?.data?.productStats || [],
    isLoading: summaryQuery.isLoading || clicksQuery.isLoading || productsQuery.isLoading,
    dateRange,
    setDateRange,
    setRange,
  };
};
