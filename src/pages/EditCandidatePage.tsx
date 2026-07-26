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
import { useCandidate } from '../features/candidates/api/use-candidate';
import { useUpdateCandidate } from '../features/candidates/api/use-update-candidate';
import { CandidateForm } from '../features/candidates/components/CandidateForm';
import type { CreateCandidateInput } from '../features/candidates/candidate.types';

export function EditCandidatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const candidateQuery = useCandidate(id ?? '');
  const updateCandidate = useUpdateCandidate();
  const [apiError, setApiError] = useState<string | null>(null);

  if (!id) {
    return <Navigate to="/candidates" replace />;
  }

  async function handleSubmit(input: CreateCandidateInput) {
    setApiError(null);

    try {
      const candidate = await updateCandidate.mutateAsync({
        id: id!,
        input,
      });

      navigate(`/candidates/${candidate.id}`, {
        replace: true,
        state: {
          successMessage: 'Candidate details were updated.',
        },
      });
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  }

  if (candidateQuery.isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (candidateQuery.isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => void candidateQuery.refetch()}
          >
            Retry
          </Button>
        }
      >
        {getApiErrorMessage(candidateQuery.error)}
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          Edit candidate
        </Typography>
        <Typography color="text.secondary">
          Update {candidateQuery.data.firstName} {candidateQuery.data.lastName}
          's information.
        </Typography>
      </Stack>

      <CandidateForm
        initialValues={candidateQuery.data}
        isSubmitting={updateCandidate.isPending}
        apiError={apiError}
        submitLabel="Save changes"
        onCancel={() => navigate(`/candidates/${id}`)}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}
