export const FEEDBACK_RECOMMENDATIONS = [
  'STRONG_HIRE',
  'HIRE',
  'MIXED',
  'NO_HIRE',
  'STRONG_NO_HIRE',
] as const;

export type FeedbackRecommendation = (typeof FEEDBACK_RECOMMENDATIONS)[number];

export interface Feedback {
  id: string;
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string;
  improvementAreas: string;
  recommendation: FeedbackRecommendation;
  additionalNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackInput {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string;
  improvementAreas: string;
  recommendation: FeedbackRecommendation;
  additionalNotes?: string;
}
