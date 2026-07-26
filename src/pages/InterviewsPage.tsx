import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useCandidates } from '../features/candidates/api/use-candidates';
import {
  INTERVIEW_STATUSES,
  INTERVIEW_TYPES,
  INTERVIEW_TYPE_LABELS,
} from '../features/interviews/interview.constants';
import { useInterviews } from '../features/interviews/api/interview-hooks';
import { InterviewsTable } from '../features/interviews/components/InterviewsTable';
import type {
  InterviewStatus,
  InterviewType,
} from '../features/interviews/interview.types';

const PAGE_SIZE = 20;

export function InterviewsPage() {
  const location = useLocation();
  const successMessage = (location.state as { successMessage?: string } | null)
    ?.successMessage;
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<InterviewStatus | ''>('');
  const [type, setType] = useState<InterviewType | ''>('');
  const [candidateId, setCandidateId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const candidatesQuery = useCandidates({ page: 1, pageSize: 100 });
  const interviewsQuery = useInterviews({
    page,
    pageSize: PAGE_SIZE,
    ...(status && { status }),
    ...(type && { type }),
    ...(candidateId && { candidateId }),
    ...(dateFrom && {
      dateFrom: new Date(`${dateFrom}T00:00:00`).toISOString(),
    }),
    ...(dateTo && {
      dateTo: new Date(`${dateTo}T23:59:59.999`).toISOString(),
    }),
  });

  function resetPage() {
    setPage(1);
  }

  const isPending = candidatesQuery.isPending || interviewsQuery.isPending;
  const hasError = candidatesQuery.isError || interviewsQuery.isError;

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
            Interviews
          </Typography>
          <Typography color="text.secondary">
            Schedule and review your mock interview sessions.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/interviews/new"
          variant="contained"
          size="large"
        >
          Create interview
        </Button>
      </Stack>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as InterviewStatus | '');
              resetPage();
            }}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="">All statuses</MenuItem>
            {INTERVIEW_STATUSES.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Type"
            value={type}
            onChange={(event) => {
              setType(event.target.value as InterviewType | '');
              resetPage();
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All types</MenuItem>
            {INTERVIEW_TYPES.map((value) => (
              <MenuItem key={value} value={value}>
                {INTERVIEW_TYPE_LABELS[value]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Candidate"
            value={candidateId}
            onChange={(event) => {
              setCandidateId(event.target.value);
              resetPage();
            }}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">All candidates</MenuItem>
            {candidatesQuery.data?.data.map((candidate) => (
              <MenuItem key={candidate.id} value={candidate.id}>
                {candidate.firstName} {candidate.lastName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="From"
            type="date"
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(event.target.value);
              resetPage();
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="To"
            type="date"
            value={dateTo}
            onChange={(event) => {
              setDateTo(event.target.value);
              resetPage();
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </Paper>

      {isPending && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {hasError && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                void candidatesQuery.refetch();
                void interviewsQuery.refetch();
              }}
            >
              Retry
            </Button>
          }
        >
          Interviews could not be loaded.
        </Alert>
      )}

      {interviewsQuery.data &&
        candidatesQuery.data &&
        interviewsQuery.data.data.length === 0 && (
          <Paper variant="outlined" sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No interviews found
            </Typography>
            <Typography color="text.secondary">
              Create an interview or adjust the current filters.
            </Typography>
          </Paper>
        )}

      {interviewsQuery.data &&
        candidatesQuery.data &&
        interviewsQuery.data.data.length > 0 && (
          <>
            <InterviewsTable
              interviews={interviewsQuery.data.data}
              candidates={candidatesQuery.data.data}
            />
            {interviewsQuery.data.pagination.totalPages > 1 && (
              <Pagination
                page={interviewsQuery.data.pagination.page}
                count={interviewsQuery.data.pagination.totalPages}
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
