import type { PropsWithChildren } from 'react';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';

interface AuthPageLayoutProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export function AuthPageLayout({
  title,
  subtitle,
  children,
}: AuthPageLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                component="h1"
                variant="h4"
                sx={{ fontWeight: 700 }}
                gutterBottom
              >
                {title}
              </Typography>

              <Typography color="text.secondary">{subtitle}</Typography>
            </Box>

            {children}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
