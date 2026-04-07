import { apiClient } from './client';
import type { Progress, ApiSuccess } from '@/types';

export const progressApi = {
  getOverview: (): Promise<ApiSuccess<{ progresses: Progress[] }>> =>
    apiClient.get('/progress/overview'),

  getCourseProgress: (courseId: string): Promise<ApiSuccess<{ progress: Progress; examResults: any[] }>> =>
    apiClient.get(`/progress/course/${courseId}`),

  getStudentProgress: (studentId: string): Promise<ApiSuccess<{ progresses: Progress[]; results: any[] }>> =>
    apiClient.get(`/progress/students/${studentId}`),

  getTrackingOverview: (): Promise<ApiSuccess<{ tracking: any[] }>> =>
    apiClient.get('/progress/tracking'),
};
