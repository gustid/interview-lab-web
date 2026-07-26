import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCandidate } from './candidates-api';
import type { CreateCandidateInput } from '../candidate.types';

interface UpdateCandidateVariables {
  id: string;
  input: CreateCandidateInput;
}

export function useUpdateCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateCandidateVariables) =>
      updateCandidate(id, input),
    onSuccess: async (candidate) => {
      queryClient.setQueryData(['candidates', candidate.id], candidate);
      await queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}
