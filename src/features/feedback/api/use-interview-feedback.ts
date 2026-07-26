import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import type { Feedback } from '../feedback.types';

async function getInterviewFeedback(
  interviewId: string,
): Promise<Feedback | null> {
  try {
    const response = await apiClient.get<Feedback>(
      `/interviews/${interviewId}/feedback`,
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export function useInterviewFeedback(interviewId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['interviews', interviewId, 'feedback'],
    queryFn: () => getInterviewFeedback(interviewId),
    enabled,
    retry: false,
  });
}
