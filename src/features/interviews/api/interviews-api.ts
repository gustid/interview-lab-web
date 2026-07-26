import apiClient from '../../../api/client';
import type {
  Interview,
  InterviewFilters,
  InterviewInput,
  InterviewListResponse,
} from '../interview.types';

export async function getInterviews(
  filters: InterviewFilters,
): Promise<InterviewListResponse> {
  const response = await apiClient.get<InterviewListResponse>('/interviews', {
    params: filters,
  });
  return response.data;
}

export async function getInterview(id: string): Promise<Interview> {
  const response = await apiClient.get<Interview>(`/interviews/${id}`);
  return response.data;
}

export async function createInterview(
  input: InterviewInput,
): Promise<Interview> {
  const response = await apiClient.post<Interview>('/interviews', input);
  return response.data;
}

export async function updateInterview(
  id: string,
  input: InterviewInput,
): Promise<Interview> {
  const response = await apiClient.put<Interview>(`/interviews/${id}`, input);
  return response.data;
}

export async function deleteInterview(id: string): Promise<void> {
  await apiClient.delete(`/interviews/${id}`);
}

export async function completeInterview(id: string): Promise<Interview> {
  const response = await apiClient.post<Interview>(
    `/interviews/${id}/complete`,
  );
  return response.data;
}
