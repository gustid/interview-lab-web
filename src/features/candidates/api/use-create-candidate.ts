import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCandidate } from './candidates-api';

export function useCreateCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCandidate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}
