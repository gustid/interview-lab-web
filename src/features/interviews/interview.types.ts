import type {
  INTERVIEW_DIFFICULTIES,
  INTERVIEW_STATUSES,
  INTERVIEW_TYPES,
} from './interview.constants';

export type InterviewType = (typeof INTERVIEW_TYPES)[number];
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];
export type InterviewDifficulty = (typeof INTERVIEW_DIFFICULTIES)[number];

export interface Interview {
  id: string;
  candidateId: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  type: InterviewType;
  status: InterviewStatus;
  difficulty: InterviewDifficulty | null;
  technologies: string[];
  notes: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewInput {
  candidateId: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  type: InterviewType;
  difficulty?: InterviewDifficulty;
  technologies?: string[];
  notes?: string;
}

export interface InterviewFilters {
  page: number;
  pageSize: number;
  status?: InterviewStatus;
  type?: InterviewType;
  candidateId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface InterviewListResponse {
  data: Interview[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
