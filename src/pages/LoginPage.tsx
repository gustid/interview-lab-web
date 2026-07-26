import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Link as RouterLink,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { getApiErrorMessage } from '../api/get-api-error-message';
import type { LoginInput } from '../features/auth/auth.types';
import { AuthPageLayout } from '../features/auth/components/AuthPageLayout';
import { useAuth } from '../features/auth/use-auth';

interface LoginLocationState {
  from?: {
    pathname: string;
  };
  registrationSuccessful?: boolean;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const state = location.state as LoginLocationState | null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(input: LoginInput) {
    setApiError(null);

    try {
      await login(input);

      navigate(state?.from?.pathname ?? '/dashboard', {
        replace: true,
      });
    } catch (error: unknown) {
      setApiError(getApiErrorMessage(error));
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to continue practicing interviews."
    >
      {state?.registrationSuccessful && (
        <Alert severity="success">
          Account created successfully. You can now sign in.
        </Alert>
      )}

      {apiError && <Alert severity="error">{apiError}</Alert>}

      <Stack
        component="form"
        spacing={2}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          fullWidth
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
            maxLength: {
              value: 255,
              message: 'Email is too long',
            },
          })}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          fullWidth
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            maxLength: {
              value: 128,
              message: 'Password is too long',
            },
          })}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign in'
          )}
        </Button>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Don't have an account?{' '}
        <Link component={RouterLink} to="/register">
          Create one
        </Link>
      </Typography>
    </AuthPageLayout>
  );
}
