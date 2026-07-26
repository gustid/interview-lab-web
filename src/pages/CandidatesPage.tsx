import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useCandidates } from '../features/candidates/api/use-candidates';
import { CandidatesTable } from '../features/candidates/components/CandidatesTable';

const PAGE_SIZE = 20;

export function CandidatesPage() {
  const location = useLocation();
  const successMessage = (location.state as { successMessage?: string } | null)
    ?.successMessage;
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, refetch } = useCandidates({
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
            Candidates
          </Typography>
          <Typography color="text.secondary">
            Manage the people taking part in your mock interviews.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/candidates/new"
          variant="contained"
          size="large"
        >
          Add candidate
        </Button>
      </Stack>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {isPending && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        >
          {error instanceof Error
            ? error.message
            : 'Candidates could not be loaded.'}
        </Alert>
      )}

      {data && data.data.length === 0 && (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No candidates yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Add your first candidate to start scheduling interviews.
          </Typography>
          <Button
            component={RouterLink}
            to="/candidates/new"
            variant="contained"
          >
            Add candidate
          </Button>
        </Paper>
      )}

      {data && data.data.length > 0 && (
        <>
          <CandidatesTable candidates={data.data} />

          {data.pagination.totalPages > 1 && (
            <Pagination
              page={data.pagination.page}
              count={data.pagination.totalPages}
              onChange={(_, nextPage) => setPage(nextPage)}
              color="primary"
              sx={{ alignSelf: 'center' }}
            />
          )}
        </>
      )}
    </Stack>
  );
}
