import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useCandidates } from '../features/candidates/api/use-candidates';
import { useInterviews } from '../features/interviews/api/interview-hooks';
import { InterviewsTable } from '../features/interviews/components/InterviewsTable';

interface SummaryCardProps {
  label: string;
  value: number | string;
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography color="text.secondary">{label}</Typography>
    </Paper>
  );
}

export function DashboardPage() {
  const candidatesQuery = useCandidates({ page: 1, pageSize: 100 });
  const recentInterviewsQuery = useInterviews({ page: 1, pageSize: 5 });
  const scheduledInterviewsQuery = useInterviews({
    page: 1,
    pageSize: 1,
    status: 'SCHEDULED',
  });
  const completedInterviewsQuery = useInterviews({
    page: 1,
    pageSize: 1,
    status: 'COMPLETED',
  });

  const queries = [
    candidatesQuery,
    recentInterviewsQuery,
    scheduledInterviewsQuery,
    completedInterviewsQuery,
  ];
  const isPending = queries.some((query) => query.isPending);
  const isError = queries.some((query) => query.isError);

  if (isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">The dashboard summary could not be loaded.</Alert>
    );
  }

  const totalInterviews = recentInterviewsQuery.data?.pagination.total ?? 0;
  const completedInterviews =
    completedInterviewsQuery.data?.pagination.total ?? 0;
  const completionRate =
    totalInterviews > 0
      ? `${Math.round((completedInterviews / totalInterviews) * 100)}%`
      : '0%';

  return (
    <Stack spacing={4}>
      <Box>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          A quick overview of your interview practice activity.
        </Typography>
      </Box>

      <Stack direction="row" spacing={2}>
        <SummaryCard
          label="Candidates"
          value={candidatesQuery.data?.pagination.total ?? 0}
        />
        <SummaryCard label="Total interviews" value={totalInterviews} />
        <SummaryCard
          label="Scheduled"
          value={scheduledInterviewsQuery.data?.pagination.total ?? 0}
        />
        <SummaryCard label="Completed" value={completedInterviews} />
        <SummaryCard label="Completion rate" value={completionRate} />
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6">Latest interviews</Typography>
        {recentInterviewsQuery.data?.data.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 5, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Your latest interview sessions will appear here.
            </Typography>
          </Paper>
        ) : (
          <InterviewsTable
            interviews={recentInterviewsQuery.data?.data ?? []}
            candidates={candidatesQuery.data?.data ?? []}
          />
        )}
      </Stack>
    </Stack>
  );
}
