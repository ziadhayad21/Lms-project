import { apiClient, apiUpload } from './client';
import type { Course, CreateCoursePayload, ApiSuccess } from '@/types';

interface CoursesResponse extends ApiSuccess<{ courses: Course[] }> {}
interface CourseResponse  extends ApiSuccess<{ course:  Course    }> {}

export const courseApi = {
  list: (params?: Record<string, string | number>): Promise<CoursesResponse> =>
    apiClient.get('/courses', { params }),

  get: (courseId: string): Promise<CourseResponse> =>
    apiClient.get(`/courses/${courseId}`),

  create: (payload: CreateCoursePayload, thumbnail?: File): Promise<CourseResponse> => {
    if (thumbnail) {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach((item) => fd.append(k, item));
        else fd.append(k, String(v));
      });
      fd.append('image', thumbnail);
      return apiUpload<CourseResponse>('/courses', fd);
    }
    return apiClient.post('/courses', payload);
  },

  update: (courseId: string, payload: Partial<CreateCoursePayload>, thumbnail?: File): Promise<CourseResponse> => {
    if (thumbnail) {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined) fd.append(k, String(v));
      });
      fd.append('image', thumbnail);
      return apiUpload<CourseResponse>(`/courses/${courseId}`, fd, 'patch');
    }
    return apiClient.patch(`/courses/${courseId}`, payload);
  },

  delete: (courseId: string): Promise<void> =>
    apiClient.delete(`/courses/${courseId}`),

  enroll: (courseId: string): Promise<ApiSuccess<{ message: string }>> =>
    apiClient.post(`/courses/${courseId}/enroll`),

  getStudents: (courseId: string): Promise<ApiSuccess<{ students: any[] }>> =>
    apiClient.get(`/courses/${courseId}/students`),

  getTeacherDashboard: (): Promise<ApiSuccess<any>> =>
    apiClient.get('/courses/teacher/dashboard'),
};
