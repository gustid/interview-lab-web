import { useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import type { Candidate } from '../../candidates/candidate.types';
import {
  INTERVIEW_DIFFICULTIES,
  INTERVIEW_TYPES,
  INTERVIEW_TYPE_LABELS,
} from '../interview.constants';
import type {
  Interview,
  InterviewDifficulty,
  InterviewInput,
  InterviewType,
} from '../interview.types';

interface InterviewFormValues {
  candidateId: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  type: InterviewType;
  difficulty: InterviewDifficulty | '';
  technologies: string;
  notes: string;
}

interface InterviewFormProps {
  candidates: Candidate[];
  initialValues?: Interview;
  isSubmitting: boolean;
  apiError: string | null;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (input: InterviewInput) => Promise<void>;
}

// Convert ISO date string to local date-time string in the format "YYYY-MM-DDTHH:mm"
// This is necessary because the HTML input type "datetime-local" expects a local date-time string.
// needed in edit mode to prefill the form with the existing interview's scheduledAt value.
function toLocalDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );
  return localDate.toISOString().slice(0, 16);
}

export function InterviewForm({
  candidates,
  initialValues,
  isSubmitting,
  apiError,
  submitLabel,
  onCancel,
  onSubmit,
}: InterviewFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterviewFormValues>({
    defaultValues: {
      candidateId: initialValues?.candidateId ?? '',
      title: initialValues?.title ?? '',
      scheduledAt: initialValues
        ? toLocalDateTime(initialValues.scheduledAt)
        : '',
      durationMinutes: initialValues?.durationMinutes ?? 60,
      type: initialValues?.type ?? 'CODING',
      difficulty: initialValues?.difficulty ?? '',
      technologies: initialValues?.technologies.join(', ') ?? '',
      notes: initialValues?.notes ?? '',
    },
  });

  async function submit(values: InterviewFormValues) {
    const technologies = [
      ...new Set(
        values.technologies
          .split(',')
          .map((technology) => technology.trim())
          .filter(Boolean),
      ),
    ];
    const notes = values.notes.trim();

    await onSubmit({
      candidateId: values.candidateId,
      title: values.title.trim(),
      scheduledAt: new Date(values.scheduledAt).toISOString(),
      durationMinutes: Number(values.durationMinutes),
      type: values.type,
      ...(values.difficulty && { difficulty: values.difficulty }),
      ...(technologies.length > 0 && { technologies }),
      ...(notes && { notes }),
    });
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, maxWidth: 800 }}>
      <Stack
        component="form"
        spacing={2.5}
        onSubmit={handleSubmit(submit)}
        noValidate
      >
        {apiError && <Alert severity="error">{apiError}</Alert>}

        <TextField
          select
          label="Candidate"
          fullWidth
          error={Boolean(errors.candidateId)}
          helperText={errors.candidateId?.message}
          {...register('candidateId', {
            required: 'Candidate is required',
          })}
        >
          {candidates.map((candidate) => (
            <MenuItem key={candidate.id} value={candidate.id}>
              {candidate.firstName} {candidate.lastName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Title"
          fullWidth
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must contain at least 3 characters',
            },
            maxLength: {
              value: 150,
              message: 'Title must not exceed 150 characters',
            },
          })}
        />

        <Stack direction="row" spacing={2}>
          <TextField
            label="Scheduled at"
            type="datetime-local"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.scheduledAt)}
            helperText={errors.scheduledAt?.message}
            {...register('scheduledAt', {
              required: 'Date and time are required',
            })}
          />
          <TextField
            label="Duration (minutes)"
            type="number"
            fullWidth
            error={Boolean(errors.durationMinutes)}
            helperText={errors.durationMinutes?.message}
            {...register('durationMinutes', {
              valueAsNumber: true,
              required: 'Duration is required',
              min: { value: 15, message: 'Minimum duration is 15 minutes' },
              max: { value: 240, message: 'Maximum duration is 240 minutes' },
            })}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Interview type"
            fullWidth
            {...register('type', { required: true })}
          >
            {INTERVIEW_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {INTERVIEW_TYPE_LABELS[type]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Difficulty"
            fullWidth
            {...register('difficulty')}
          >
            <MenuItem value="">Not specified</MenuItem>
            {INTERVIEW_DIFFICULTIES.map((difficulty) => (
              <MenuItem key={difficulty} value={difficulty}>
                {difficulty}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <TextField
          label="Technologies"
          placeholder="React, NestJS, PostgreSQL"
          fullWidth
          error={Boolean(errors.technologies)}
          helperText={
            errors.technologies?.message ??
            'Separate technologies with commas (maximum 20).'
          }
          {...register('technologies', {
            validate: (value) => {
              const items = value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
              if (items.length > 20) return 'Use no more than 20 technologies';
              if (items.some((item) => item.length > 100)) {
                return 'Each technology must not exceed 100 characters';
              }
              return true;
            },
          })}
        />

        <TextField
          label="Notes"
          multiline
          minRows={4}
          fullWidth
          error={Boolean(errors.notes)}
          helperText={errors.notes?.message}
          {...register('notes', {
            maxLength: {
              value: 5000,
              message: 'Notes must not exceed 5,000 characters',
            },
          })}
        />

        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
          <Button type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              submitLabel
            )}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
