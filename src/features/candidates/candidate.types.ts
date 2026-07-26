export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentRole: string | null;
  targetRole: string | null;
  resumeUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateListResponse {
  data: Candidate[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  currentRole?: string;
  targetRole?: string;
  notes?: string;
}
