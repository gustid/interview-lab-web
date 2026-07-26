import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  Link as RouterLink,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { getApiErrorMessage } from '../api/get-api-error-message';
import { useCandidate } from '../features/candidates/api/use-candidate';
import { useDeleteCandidate } from '../features/candidates/api/use-delete-candidate';

interface DetailRowProps {
  label: string;
  value: string | null;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value || '—'}</Typography>
    </Box>
  );
}

export function CandidateDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const candidateQuery = useCandidate(id ?? '');
  const deleteCandidate = useDeleteCandidate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const successMessage = (location.state as { successMessage?: string } | null)
    ?.successMessage;

  if (!id) {
    return <Navigate to="/candidates" replace />;
  }

  async function handleDelete() {
    setDeleteError(null);

    try {
      await deleteCandidate.mutateAsync(id!);
      navigate('/candidates', {
        replace: true,
        state: { successMessage: 'Candidate was deleted.' },
      });
    } catch (error: unknown) {
      setDeleteError(getApiErrorMessage(error));
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

  const candidate = candidateQuery.data;

  return (
    <Stack spacing={3}>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <Box>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
            {candidate.firstName} {candidate.lastName}
          </Typography>
          <Typography color="text.secondary">
            Candidate information and interview history.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button component={RouterLink} to="/candidates" variant="outlined">
            Back
          </Button>
          <Button
            component={RouterLink}
            to={`/candidates/${candidate.id}/edit`}
            variant="contained"
          >
            Edit
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3, maxWidth: 800 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Candidate details</Typography>
          <Divider />
          <Stack direction="row" spacing={8}>
            <DetailRow label="Email" value={candidate.email} />
            <DetailRow label="Current role" value={candidate.currentRole} />
            <DetailRow label="Target role" value={candidate.targetRole} />
          </Stack>
          <DetailRow label="Resume URL" value={candidate.resumeUrl} />
          <DetailRow label="Notes" value={candidate.notes} />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, maxWidth: 800 }}>
        <Typography variant="h6" gutterBottom>
          Interview history
        </Typography>
        <Typography color="text.secondary">
          This candidate's interviews will appear here after the interview
          frontend is connected.
        </Typography>
      </Paper>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() =>
          !deleteCandidate.isPending && setIsDeleteDialogOpen(false)
        }
      >
        <DialogTitle>Delete candidate?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {candidate.firstName} {candidate.lastName} will be permanently
            deleted. Candidates with interview history cannot be deleted.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={deleteCandidate.isPending}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void handleDelete()}
            disabled={deleteCandidate.isPending}
          >
            {deleteCandidate.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Delete candidate'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
