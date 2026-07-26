import { useState } from 'react';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getApiErrorMessage } from '../api/get-api-error-message';
import { useCandidates } from '../features/candidates/api/use-candidates';
import {
  useInterview,
  useUpdateInterview,
} from '../features/interviews/api/interview-hooks';
import { InterviewForm } from '../features/interviews/components/InterviewForm';
import type { InterviewInput } from '../features/interviews/interview.types';

export function EditInterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const interviewQuery = useInterview(id ?? '');
  const candidatesQuery = useCandidates({ page: 1, pageSize: 100 });
  const updateInterview = useUpdateInterview();
  const [apiError, setApiError] = useState<string | null>(null);

  if (!id) return <Navigate to="/interviews" replace />;

  async function handleSubmit(input: InterviewInput) {
    setApiError(null);
    try {
      const interview = await updateInterview.mutateAsync({ id: id!, input });
      navigate(`/interviews/${interview.id}`, {
        replace: true,
        state: { successMessage: 'Interview was updated.' },
      });
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  }

  if (interviewQuery.isPending || candidatesQuery.isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (interviewQuery.isError || candidatesQuery.isError) {
    return (
      <Alert severity="error">Interview details could not be loaded.</Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          Edit interview
        </Typography>
        <Typography color="text.secondary">
          Update this mock interview session.
        </Typography>
      </Stack>
      <InterviewForm
        candidates={candidatesQuery.data.data}
        initialValues={interviewQuery.data}
        isSubmitting={updateInterview.isPending}
        apiError={apiError}
        submitLabel="Save changes"
        onCancel={() => navigate(`/interviews/${id}`)}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}
