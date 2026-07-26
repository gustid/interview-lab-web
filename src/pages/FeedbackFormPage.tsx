import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getApiErrorMessage } from '../api/get-api-error-message';
import {
  useCreateFeedback,
  useUpdateFeedback,
} from '../features/feedback/api/feedback-mutations';
import { useInterviewFeedback } from '../features/feedback/api/use-interview-feedback';
import { FeedbackForm } from '../features/feedback/components/FeedbackForm';
import type { FeedbackInput } from '../features/feedback/feedback.types';
import { useInterview } from '../features/interviews/api/interview-hooks';

interface FeedbackFormPageProps {
  mode: 'create' | 'edit';
}

export function FeedbackFormPage({ mode }: FeedbackFormPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const interviewQuery = useInterview(id ?? '');
  const feedbackQuery = useInterviewFeedback(
    id ?? '',
    mode === 'edit' && interviewQuery.data?.status === 'COMPLETED',
  );
  const createFeedback = useCreateFeedback();
  const updateFeedback = useUpdateFeedback();
  const [apiError, setApiError] = useState<string | null>(null);

  if (!id) return <Navigate to="/interviews" replace />;

  async function handleSubmit(input: FeedbackInput) {
    setApiError(null);
    try {
      const mutation =
        mode === 'create'
          ? createFeedback.mutateAsync
          : updateFeedback.mutateAsync;
      await mutation({ interviewId: id!, input });
      navigate(`/interviews/${id}`, {
        replace: true,
        state: {
          successMessage:
            mode === 'create'
              ? 'Feedback was recorded.'
              : 'Feedback was updated.',
        },
      });
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  }

  if (interviewQuery.isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (interviewQuery.isError) {
    return <Alert severity="error">Interview could not be loaded.</Alert>;
  }

  if (interviewQuery.data.status !== 'COMPLETED') {
    return (
      <Alert
        severity="warning"
        action={
          <Button color="inherit" onClick={() => navigate(`/interviews/${id}`)}>
            Back
          </Button>
        }
      >
        Feedback can only be recorded for completed interviews.
      </Alert>
    );
  }

  if (mode === 'edit' && feedbackQuery.isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (mode === 'edit' && feedbackQuery.isError) {
    return <Alert severity="error">Feedback could not be loaded.</Alert>;
  }

  if (mode === 'edit' && !feedbackQuery.data) {
    return <Navigate to={`/interviews/${id}/feedback/new`} replace />;
  }

  const mutation = mode === 'create' ? createFeedback : updateFeedback;

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          {mode === 'create' ? 'Record feedback' : 'Edit feedback'}
        </Typography>
        <Typography color="text.secondary">
          {interviewQuery.data.title}
        </Typography>
      </Stack>

      <FeedbackForm
        initialValues={feedbackQuery.data ?? undefined}
        isSubmitting={mutation.isPending}
        apiError={apiError}
        submitLabel={mode === 'create' ? 'Save feedback' : 'Save changes'}
        onCancel={() => navigate(`/interviews/${id}`)}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}
