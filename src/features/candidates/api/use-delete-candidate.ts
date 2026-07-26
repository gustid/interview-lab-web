import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCandidate } from './candidates-api';

export function useDeleteCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCandidate,
    onSuccess: async (_, id) => {
      queryClient.removeQueries({ queryKey: ['candidates', id] });
      await queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });
}
