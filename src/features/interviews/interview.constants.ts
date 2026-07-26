export const INTERVIEW_TYPES = [
  'CODING',
  'SYSTEM_DESIGN',
  'BEHAVIORAL',
  'FULL_STACK',
  'BACKEND',
  'FRONTEND',
] as const;

export const INTERVIEW_STATUSES = [
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
] as const;

export const INTERVIEW_DIFFICULTIES = [
  'JUNIOR',
  'MID',
  'SENIOR',
  'EXPERT',
] as const;

export const INTERVIEW_TYPE_LABELS = {
  CODING: 'Coding',
  SYSTEM_DESIGN: 'System design',
  BEHAVIORAL: 'Behavioral',
  FULL_STACK: 'Full stack',
  BACKEND: 'Backend',
  FRONTEND: 'Frontend',
} as const;
