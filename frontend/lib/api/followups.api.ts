import { apiClient } from './client';
import type { ApiSuccess } from '@/types';

export type FollowUpType = 'note' | 'reminder' | 'feedback';

export interface FollowUp {
  _id: string;
  teacher: string;
  student: string;
  type: FollowUpType;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export const followUpsApi = {
  create: (payload: { studentId: string; type: FollowUpType; message: string }): Promise<ApiSuccess<{ followUp: FollowUp }>> =>
    apiClient.post('/followups', payload),

  listForStudent: (studentId: string): Promise<ApiSuccess<{ followUps: FollowUp[] }>> =>
    apiClient.get(`/followups/students/${studentId}`),
};

