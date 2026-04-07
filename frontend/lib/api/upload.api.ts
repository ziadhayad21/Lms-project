import { apiClient } from './client';
import type { ApiSuccess } from '@/types';

export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    // Using apiClient directly for FormData requires setting headers properly
    // apiClient sets application/json by default, so we override Content-Type handles it automatically
    const res = await apiClient.post<ApiSuccess<{ url: string }>>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  },
};
