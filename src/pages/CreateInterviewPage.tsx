import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/get-api-error-message';
import { useCandidates } from '../features/candidates/api/use-candidates';
import { useCreateInterview } from '../features/interviews/api/interview-hooks';
import { InterviewForm } from '../features/interviews/components/InterviewForm';
import type { InterviewInput } from '../features/interviews/interview.types';

export function CreateInterviewPage() {
  const navigate = useNavigate();
  const candidatesQuery = useCandidates({ page: 1, pageSize: 100 });
  const createInterview = useCreateInterview();
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleSubmit(input: InterviewInput) {
    setApiError(null);
    try {
      const interview = await createInterview.mutateAsync(input);
      navigate(`/interviews/${interview.id}`, {
        replace: true,
        state: { successMessage: 'Interview was created.' },
      });
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  }

  if (candidatesQuery.isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (candidatesQuery.isError) {
    return <Alert severity="error">Candidates could not be loaded.</Alert>;
  }

  if (candidatesQuery.data.data.length === 0) {
    return (
      <Alert
        severity="info"
        action={
          <Button color="inherit" onClick={() => navigate('/candidates/new')}>
            Add candidate
          </Button>
        }
      >
        Add a candidate before creating an interview.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          Create interview
        </Typography>
        <Typography color="text.secondary">
          Schedule a new mock interview session.
        </Typography>
      </Stack>
      <InterviewForm
        candidates={candidatesQuery.data.data}
        isSubmitting={createInterview.isPending}
        apiError={apiError}
        submitLabel="Create interview"
        onCancel={() => navigate('/interviews')}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}
