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
import {
  FEEDBACK_RECOMMENDATIONS,
  type Feedback,
  type FeedbackInput,
  type FeedbackRecommendation,
} from '../feedback.types';

interface FeedbackFormProps {
  initialValues?: Feedback;
  isSubmitting: boolean;
  apiError: string | null;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (input: FeedbackInput) => Promise<void>;
}

const recommendationLabels: Record<FeedbackRecommendation, string> = {
  STRONG_HIRE: 'Strong hire',
  HIRE: 'Hire',
  MIXED: 'Mixed',
  NO_HIRE: 'No hire',
  STRONG_NO_HIRE: 'Strong no hire',
};

export function FeedbackForm({
  initialValues,
  isSubmitting,
  apiError,
  submitLabel,
  onCancel,
  onSubmit,
}: FeedbackFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackInput>({
    defaultValues: {
      overallScore: initialValues?.overallScore ?? 5,
      technicalScore: initialValues?.technicalScore ?? 5,
      communicationScore: initialValues?.communicationScore ?? 5,
      problemSolvingScore: initialValues?.problemSolvingScore ?? 5,
      strengths: initialValues?.strengths ?? '',
      improvementAreas: initialValues?.improvementAreas ?? '',
      recommendation: initialValues?.recommendation ?? 'MIXED',
      additionalNotes: initialValues?.additionalNotes ?? '',
    },
  });

  async function submit(values: FeedbackInput) {
    const additionalNotes = values.additionalNotes?.trim();
    await onSubmit({
      ...values,
      overallScore: Number(values.overallScore),
      technicalScore: Number(values.technicalScore),
      communicationScore: Number(values.communicationScore),
      problemSolvingScore: Number(values.problemSolvingScore),
      strengths: values.strengths.trim(),
      improvementAreas: values.improvementAreas.trim(),
      ...(additionalNotes && { additionalNotes }),
    });
  }

  const scoreValidation = {
    valueAsNumber: true,
    required: 'Score is required',
    min: { value: 1, message: 'Minimum score is 1' },
    max: { value: 10, message: 'Maximum score is 10' },
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, maxWidth: 850 }}>
      <Stack
        component="form"
        spacing={2.5}
        onSubmit={handleSubmit(submit)}
        noValidate
      >
        {apiError && <Alert severity="error">{apiError}</Alert>}

        <Stack direction="row" spacing={2}>
          {(
            [
              ['overallScore', 'Overall score'],
              ['technicalScore', 'Technical score'],
              ['communicationScore', 'Communication score'],
              ['problemSolvingScore', 'Problem solving'],
            ] as const
          ).map(([name, label]) => (
            <TextField
              key={name}
              label={label}
              type="number"
              fullWidth
              error={Boolean(errors[name])}
              helperText={errors[name]?.message}
              {...register(name, scoreValidation)}
            />
          ))}
        </Stack>

        <TextField
          select
          label="Recommendation"
          fullWidth
          {...register('recommendation', { required: true })}
        >
          {FEEDBACK_RECOMMENDATIONS.map((recommendation) => (
            <MenuItem key={recommendation} value={recommendation}>
              {recommendationLabels[recommendation]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Strengths"
          multiline
          minRows={4}
          fullWidth
          error={Boolean(errors.strengths)}
          helperText={errors.strengths?.message}
          {...register('strengths', {
            required: 'Strengths are required',
            validate: (value) =>
              value.trim().length > 0 || 'Strengths are required',
            maxLength: {
              value: 5000,
              message: 'Strengths must not exceed 5,000 characters',
            },
          })}
        />

        <TextField
          label="Improvement areas"
          multiline
          minRows={4}
          fullWidth
          error={Boolean(errors.improvementAreas)}
          helperText={errors.improvementAreas?.message}
          {...register('improvementAreas', {
            required: 'Improvement areas are required',
            validate: (value) =>
              value.trim().length > 0 || 'Improvement areas are required',
            maxLength: {
              value: 5000,
              message: 'Improvement areas must not exceed 5,000 characters',
            },
          })}
        />

        <TextField
          label="Additional notes"
          multiline
          minRows={3}
          fullWidth
          error={Boolean(errors.additionalNotes)}
          helperText={errors.additionalNotes?.message}
          {...register('additionalNotes', {
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
