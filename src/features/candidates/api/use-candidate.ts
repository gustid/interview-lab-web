import { useQuery } from '@tanstack/react-query';
import { getCandidate } from './candidates-api';

export function useCandidate(id: string) {
  return useQuery({
    queryKey: ['candidates', id],
    queryFn: () => getCandidate(id),
    enabled: Boolean(id),
  });
}
