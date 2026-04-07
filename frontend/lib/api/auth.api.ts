import { apiClient } from './client';
import type { User, RegisterPayload, LoginPayload, ApiSuccess } from '@/types';

interface AuthResponse extends ApiSuccess<{ user: User }> {}
interface StudentsResponse extends ApiSuccess<{ students: User[] }> {}

export const authApi = {
  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    apiClient.post('/auth/register', payload),

  login: (payload: LoginPayload): Promise<AuthResponse> =>
    apiClient.post('/auth/login', payload),

  logout: (): Promise<void> =>
    apiClient.post('/auth/logout'),

  getMe: (): Promise<AuthResponse> =>
    apiClient.get('/auth/me'),

  updatePassword: (currentPassword: string, newPassword: string): Promise<AuthResponse> =>
    apiClient.patch('/auth/update-password', { currentPassword, newPassword }),

  listStudents: (status?: 'pending' | 'active'): Promise<StudentsResponse> =>
    apiClient.get(`/auth/students${status ? `?status=${status}` : ''}`),

  updateStudentStatus: (studentId: string, status: 'pending' | 'active'): Promise<AuthResponse> =>
    apiClient.patch(`/auth/students/${studentId}/status`, { status }),
};
