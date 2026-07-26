import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/get-api-error-message';
import { useCreateCandidate } from '../features/candidates/api/use-create-candidate';
import { CandidateForm } from '../features/candidates/components/CandidateForm';
import type { CreateCandidateInput } from '../features/candidates/candidate.types';

export function CreateCandidatePage() {
  const navigate = useNavigate();
  const createCandidate = useCreateCandidate();
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleSubmit(input: CreateCandidateInput) {
    setApiError(null);

    try {
      const candidate = await createCandidate.mutateAsync(input);

      navigate('/candidates', {
        replace: true,
        state: {
          successMessage: `${candidate.firstName} ${candidate.lastName} was added.`,
        },
      });
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          Add candidate
        </Typography>
        <Typography color="text.secondary">
          Add someone you want to include in mock interview sessions.
        </Typography>
      </Stack>

      <CandidateForm
        isSubmitting={createCandidate.isPending}
        apiError={apiError}
        submitLabel="Create candidate"
        onCancel={() => navigate('/candidates')}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}
