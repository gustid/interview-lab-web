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
import type { Candidate } from '../candidate.types';

interface CandidatesTableProps {
  candidates: Candidate[];
}

export function CandidatesTable({ candidates }: CandidatesTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Current role</TableCell>
            <TableCell>Target role</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id} hover>
              <TableCell sx={{ fontWeight: 600 }}>
                {candidate.firstName} {candidate.lastName}
              </TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>
                {candidate.currentRole ? (
                  <Chip
                    label={candidate.currentRole}
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>
                {candidate.targetRole ? (
                  <Chip
                    label={candidate.targetRole}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell align="right">
                <Button
                  component={RouterLink}
                  to={`/candidates/${candidate.id}`}
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
