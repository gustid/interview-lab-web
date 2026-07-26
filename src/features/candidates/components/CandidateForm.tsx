import { useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import type { Candidate, CreateCandidateInput } from '../candidate.types';

interface CandidateFormValues {
  firstName: string;
  lastName: string;
  email: string;
  currentRole: string;
  targetRole: string;
  notes: string;
}

interface CandidateFormProps {
  isSubmitting: boolean;
  apiError: string | null;
  initialValues?: Candidate;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (input: CreateCandidateInput) => Promise<void>;
}

export function CandidateForm({
  isSubmitting,
  apiError,
  initialValues,
  submitLabel,
  onCancel,
  onSubmit,
}: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CandidateFormValues>({
    defaultValues: {
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      email: initialValues?.email ?? '',
      currentRole: initialValues?.currentRole ?? '',
      targetRole: initialValues?.targetRole ?? '',
      notes: initialValues?.notes ?? '',
    },
  });

  async function submit(values: CandidateFormValues) {
    const currentRole = values.currentRole.trim();
    const targetRole = values.targetRole.trim();
    const notes = values.notes.trim();

    await onSubmit({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      ...(currentRole && { currentRole }),
      ...(targetRole && { targetRole }),
      ...(notes && { notes }),
    });
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, maxWidth: 720 }}>
      <Stack
        component="form"
        spacing={2.5}
        onSubmit={handleSubmit(submit)}
        noValidate
      >
        {apiError && <Alert severity="error">{apiError}</Alert>}

        <Stack direction="row" spacing={2}>
          <TextField
            label="First name"
            autoComplete="given-name"
            fullWidth
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
            {...register('firstName', {
              required: 'First name is required',
              validate: (value) =>
                value.trim().length > 0 || 'First name is required',
              maxLength: {
                value: 120,
                message: 'First name must not exceed 120 characters',
              },
            })}
          />

          <TextField
            label="Last name"
            autoComplete="family-name"
            fullWidth
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
            {...register('lastName', {
              required: 'Last name is required',
              validate: (value) =>
                value.trim().length > 0 || 'Last name is required',
              maxLength: {
                value: 120,
                message: 'Last name must not exceed 120 characters',
              },
            })}
          />
        </Stack>

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
            maxLength: {
              value: 255,
              message: 'Email must not exceed 255 characters',
            },
          })}
        />

        <TextField
          label="Current role"
          placeholder="For example, Backend Engineer"
          fullWidth
          error={Boolean(errors.currentRole)}
          helperText={errors.currentRole?.message}
          {...register('currentRole', {
            maxLength: {
              value: 150,
              message: 'Current role must not exceed 150 characters',
            },
          })}
        />

        <TextField
          label="Target role"
          placeholder="For example, Senior Backend Engineer"
          fullWidth
          error={Boolean(errors.targetRole)}
          helperText={errors.targetRole?.message}
          {...register('targetRole', {
            maxLength: {
              value: 150,
              message: 'Target role must not exceed 150 characters',
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
