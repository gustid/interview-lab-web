import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Candidate } from '../../candidates/candidate.types';
import { INTERVIEW_TYPE_LABELS } from '../interview.constants';
import type { Interview } from '../interview.types';

interface InterviewsTableProps {
  interviews: Interview[];
  candidates: Candidate[];
}

const statusColors = {
  SCHEDULED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'default',
} as const;

export function InterviewsTable({
  interviews,
  candidates,
}: InterviewsTableProps) {
  const candidateNames = new Map(
    candidates.map((candidate) => [
      candidate.id,
      `${candidate.firstName} ${candidate.lastName}`,
    ]),
  );

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Interview</TableCell>
            <TableCell>Candidate</TableCell>
            <TableCell>Scheduled</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow key={interview.id} hover>
              <TableCell sx={{ fontWeight: 600 }}>{interview.title}</TableCell>
              <TableCell>
                {candidateNames.get(interview.candidateId) ??
                  'Unknown candidate'}
              </TableCell>
              <TableCell>
                {new Date(interview.scheduledAt).toLocaleString()}
              </TableCell>
              <TableCell>{INTERVIEW_TYPE_LABELS[interview.type]}</TableCell>
              <TableCell>
                <Chip
                  label={interview.status}
                  color={statusColors[interview.status]}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  component={RouterLink}
                  to={`/interviews/${interview.id}`}
                  size="small"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
