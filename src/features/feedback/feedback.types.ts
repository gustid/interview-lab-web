export interface Feedback {
  id: string;
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string;
  improvementAreas: string;
  recommendation:
    'STRONG_HIRE' | 'HIRE' | 'MIXED' | 'NO_HIRE' | 'STRONG_NO_HIRE';
  additionalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
