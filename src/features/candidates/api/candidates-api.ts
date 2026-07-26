import apiClient from '../../../api/client';
import type {
  Candidate,
  CandidateListResponse,
  CreateCandidateInput,
} from '../candidate.types';

interface GetCandidatesParams {
  page: number;
  pageSize: number;
}

export async function getCandidates({
  page,
  pageSize,
}: GetCandidatesParams): Promise<CandidateListResponse> {
  const response = await apiClient.get<CandidateListResponse>('/candidates', {
    params: {
      page,
      pageSize,
    },
  });

  return response.data;
}

export async function createCandidate(
  input: CreateCandidateInput,
): Promise<Candidate> {
  const response = await apiClient.post<Candidate>('/candidates', input);

  return response.data;
}

export async function getCandidate(id: string): Promise<Candidate> {
  const response = await apiClient.get<Candidate>(`/candidates/${id}`);

  return response.data;
}

export async function updateCandidate(
  id: string,
  input: CreateCandidateInput,
): Promise<Candidate> {
  const response = await apiClient.put<Candidate>(`/candidates/${id}`, input);

  return response.data;
}

export async function deleteCandidate(id: string): Promise<void> {
  await apiClient.delete(`/candidates/${id}`);
}
