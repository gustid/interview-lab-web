import { Stack, Typography } from '@mui/material';

export function InterviewsPage() {
  return (
    <Stack spacing={1}>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
        Interviews
      </Typography>
      <Typography color="text.secondary">
        Interview management will be added after candidates.
      </Typography>
    </Stack>
  );
}
