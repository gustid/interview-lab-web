import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
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
import { useInterviewFeedback } from '../features/feedback/api/use-interview-feedback';
import {
  useCompleteInterview,
  useDeleteInterview,
  useInterview,
} from '../features/interviews/api/interview-hooks';
import { INTERVIEW_TYPE_LABELS } from '../features/interviews/interview.constants';

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}

export function InterviewDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const interviewQuery = useInterview(id ?? '');
  const candidateQuery = useCandidate(interviewQuery.data?.candidateId ?? '');
  const feedbackQuery = useInterviewFeedback(
    id ?? '',
    interviewQuery.data?.status === 'COMPLETED',
  );
  const completeInterview = useCompleteInterview();
  const deleteInterview = useDeleteInterview();
  const [dialog, setDialog] = useState<'complete' | 'delete' | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const successMessage = (location.state as { successMessage?: string } | null)
    ?.successMessage;

  if (!id) return <Navigate to="/interviews" replace />;

  async function handleComplete() {
    setActionError(null);
    try {
      await completeInterview.mutateAsync(id!);
      setDialog(null);
    } catch (error: unknown) {
      setActionError(getApiErrorMessage(error));
    }
  }

  async function handleDelete() {
    setActionError(null);
    try {
      await deleteInterview.mutateAsync(id!);
      navigate('/interviews', {
        replace: true,
        state: { successMessage: 'Interview was deleted.' },
      });
    } catch (error: unknown) {
      setActionError(getApiErrorMessage(error));
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
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => void interviewQuery.refetch()}
          >
            Retry
          </Button>
        }
      >
        {getApiErrorMessage(interviewQuery.error)}
      </Alert>
    );
  }

  const interview = interviewQuery.data;
  const candidateName = candidateQuery.data
    ? `${candidateQuery.data.firstName} ${candidateQuery.data.lastName}`
    : 'Loading candidate…';
  const isActionPending =
    completeInterview.isPending || deleteInterview.isPending;

  return (
    <Stack spacing={3}>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
              {interview.title}
            </Typography>
            <Chip label={interview.status} size="small" />
          </Stack>
          <Typography color="text.secondary">{candidateName}</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button component={RouterLink} to="/interviews" variant="outlined">
            Back
          </Button>
          {interview.status === 'SCHEDULED' && (
            <>
              <Button
                component={RouterLink}
                to={`/interviews/${interview.id}/edit`}
                variant="outlined"
              >
                Edit
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setActionError(null);
                  setDialog('complete');
                }}
              >
                Mark completed
              </Button>
            </>
          )}
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              setActionError(null);
              setDialog('delete');
            }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Session details</Typography>
          <Divider />
          <Stack direction="row" spacing={8}>
            <DetailRow
              label="Scheduled at"
              value={new Date(interview.scheduledAt).toLocaleString()}
            />
            <DetailRow
              label="Duration"
              value={`${interview.durationMinutes} minutes`}
            />
            <DetailRow
              label="Type"
              value={INTERVIEW_TYPE_LABELS[interview.type]}
            />
            <DetailRow
              label="Difficulty"
              value={interview.difficulty ?? 'Not specified'}
            />
          </Stack>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Technologies
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              {interview.technologies.length > 0 ? (
                interview.technologies.map((technology) => (
                  <Chip key={technology} label={technology} size="small" />
                ))
              ) : (
                <Typography>—</Typography>
              )}
            </Stack>
          </Box>
          <DetailRow label="Notes" value={interview.notes ?? '—'} />
          {interview.completedAt && (
            <DetailRow
              label="Completed at"
              value={new Date(interview.completedAt).toLocaleString()}
            />
          )}
        </Stack>
      </Paper>

      {interview.status === 'COMPLETED' && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Feedback</Typography>
            <Divider />
            {feedbackQuery.isPending && <CircularProgress size={24} />}
            {feedbackQuery.isError && (
              <Alert severity="error">Feedback could not be loaded.</Alert>
            )}
            {feedbackQuery.data === null && (
              <Alert severity="info">
                No feedback has been recorded for this interview yet.
              </Alert>
            )}
            {feedbackQuery.data && (
              <>
                <Stack direction="row" spacing={6}>
                  <DetailRow
                    label="Overall"
                    value={`${feedbackQuery.data.overallScore}/10`}
                  />
                  <DetailRow
                    label="Technical"
                    value={`${feedbackQuery.data.technicalScore}/10`}
                  />
                  <DetailRow
                    label="Communication"
                    value={`${feedbackQuery.data.communicationScore}/10`}
                  />
                  <DetailRow
                    label="Problem solving"
                    value={`${feedbackQuery.data.problemSolvingScore}/10`}
                  />
                  <DetailRow
                    label="Recommendation"
                    value={feedbackQuery.data.recommendation.replaceAll(
                      '_',
                      ' ',
                    )}
                  />
                </Stack>
                <DetailRow
                  label="Strengths"
                  value={feedbackQuery.data.strengths}
                />
                <DetailRow
                  label="Improvement areas"
                  value={feedbackQuery.data.improvementAreas}
                />
                <DetailRow
                  label="Additional notes"
                  value={feedbackQuery.data.additionalNotes ?? '—'}
                />
              </>
            )}
          </Stack>
        </Paper>
      )}

      <Dialog
        open={dialog !== null}
        onClose={() => !isActionPending && setDialog(null)}
      >
        <DialogTitle>
          {dialog === 'complete' ? 'Complete interview?' : 'Delete interview?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialog === 'complete'
              ? 'The interview will be marked as completed so feedback can be recorded.'
              : 'This interview and any associated feedback will be permanently deleted.'}
          </DialogContentText>
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)} disabled={isActionPending}>
            Cancel
          </Button>
          <Button
            color={dialog === 'delete' ? 'error' : 'primary'}
            variant="contained"
            disabled={isActionPending}
            onClick={() =>
              void (dialog === 'complete' ? handleComplete() : handleDelete())
            }
          >
            {isActionPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : dialog === 'complete' ? (
              'Complete interview'
            ) : (
              'Delete interview'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
