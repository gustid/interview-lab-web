import apiClient from '../../../api/client';
import type { Feedback, FeedbackInput } from '../feedback.types';

export async function createFeedback(
  interviewId: string,
  input: FeedbackInput,
): Promise<Feedback> {
  const response = await apiClient.post<Feedback>(
    `/interviews/${interviewId}/feedback`,
    input,
  );
  return response.data;
}

export async function updateFeedback(
  interviewId: string,
  input: FeedbackInput,
): Promise<Feedback> {
  const response = await apiClient.put<Feedback>(
    `/interviews/${interviewId}/feedback`,
    input,
  );
  return response.data;
}
