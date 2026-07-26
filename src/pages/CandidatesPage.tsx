import { Stack, Typography } from '@mui/material';

export function CandidatesPage() {
  return (
    <Stack spacing={1}>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
        Candidates
      </Typography>
      <Typography color="text.secondary">
        Candidate management will be added next.
      </Typography>
    </Stack>
  );
}
