import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/use-auth';

const navigation = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Candidates', to: '/candidates' },
  { label: 'Interviews', to: '/interviews' },
];

export function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <Box sx={{ minWidth: 1024, minHeight: '100vh' }}>
      <AppBar position="static" color="inherit" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 72 }}>
            <Typography
              component={NavLink}
              to="/dashboard"
              variant="h5"
              color="primary"
              sx={{
                mr: 6,
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              InterviewLab
            </Typography>

            <Stack direction="row" spacing={1}>
              {navigation.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  color="inherit"
                  sx={{
                    px: 2,
                    '&.active': {
                      color: 'primary.main',
                      backgroundColor: 'primary.50',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            <Stack sx={{ mr: 2, textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Stack>

            <Button variant="outlined" onClick={handleLogout}>
              Log out
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Divider />

      <Container component="main" maxWidth="xl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
