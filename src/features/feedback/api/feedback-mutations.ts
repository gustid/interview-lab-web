import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFeedback, updateFeedback } from './feedback-api';
import type { FeedbackInput } from '../feedback.types';

interface FeedbackVariables {
  interviewId: string;
  input: FeedbackInput;
}

function useFeedbackMutation(
  mutationFn: (
    interviewId: string,
    input: FeedbackInput,
  ) => ReturnType<typeof createFeedback>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ interviewId, input }: FeedbackVariables) =>
      mutationFn(interviewId, input),
    onSuccess: (feedback) => {
      queryClient.setQueryData(
        ['interviews', feedback.interviewId, 'feedback'],
        feedback,
      );
    },
  });
}

export function useCreateFeedback() {
  return useFeedbackMutation(createFeedback);
}

export function useUpdateFeedback() {
  return useFeedbackMutation(updateFeedback);
}
