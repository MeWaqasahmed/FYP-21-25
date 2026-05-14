import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeAPI } from '../api/store';
import { productsAPI } from '../api/products';
import toast from 'react-hot-toast';

export const useStore = () => {
  const queryClient = useQueryClient();

  const storeQuery = useQuery({
    queryKey: ['my-store'],
    queryFn: () => storeAPI.getMy(),
  });

  const productsQuery = useQuery({
    queryKey: ['my-products'],
    queryFn: () => productsAPI.getMy(),
  });

  const createStoreMutation = useMutation({
    mutationFn: storeAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-store']);
      toast.success('Store created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create store');
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: storeAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-store']);
      toast.success('Store updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update store');
    },
  });

  const uploadProductMutation = useMutation({
    mutationFn: productsAPI.upload,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-products']);
      toast.success('Product uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload product');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => productsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-products']);
      toast.success('Product updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: productsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-products']);
      toast.success('Product deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });

  return {
    store: storeQuery.data?.data?.data?.store,
    products: productsQuery.data?.data?.data?.products || [],
    isLoadingStore: storeQuery.isLoading,
    isLoadingProducts: productsQuery.isLoading,
    createStore: createStoreMutation.mutate,
    updateStore: updateStoreMutation.mutate,
    uploadProduct: uploadProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isCreatingStore: createStoreMutation.isPending,
    isUpdatingStore: updateStoreMutation.isPending,
    isUploadingProduct: uploadProductMutation.isPending,
  };
};
