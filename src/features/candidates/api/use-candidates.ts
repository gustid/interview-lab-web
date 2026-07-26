import { useQuery } from '@tanstack/react-query';
import { getCandidates } from './candidates-api';

interface UseCandidatesParams {
  page: number;
  pageSize: number;
}

export function useCandidates({ page, pageSize }: UseCandidatesParams) {
  return useQuery({
    queryKey: ['candidates', { page, pageSize }],
    queryFn: () => getCandidates({ page, pageSize }),
  });
}
