import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeInterview,
  createInterview,
  deleteInterview,
  getInterview,
  getInterviews,
  updateInterview,
} from './interviews-api';
import type { InterviewFilters, InterviewInput } from '../interview.types';

export function useInterviews(filters: InterviewFilters) {
  return useQuery({
    queryKey: ['interviews', filters],
    queryFn: () => getInterviews(filters),
  });
}

export function useInterview(id: string) {
  return useQuery({
    queryKey: ['interviews', id],
    queryFn: () => getInterview(id),
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInterview,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
}

export function useUpdateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: InterviewInput }) =>
      updateInterview(id, input),
    onSuccess: async (interview) => {
      queryClient.setQueryData(['interviews', interview.id], interview);
      await queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
}

export function useDeleteInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInterview,
    onSuccess: async (_, id) => {
      queryClient.removeQueries({ queryKey: ['interviews', id] });
      await queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
}

export function useCompleteInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeInterview,
    onSuccess: async (interview) => {
      queryClient.setQueryData(['interviews', interview.id], interview);
      await queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
}
