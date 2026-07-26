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
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/get-api-error-message';
import { register as registerRequest } from '../features/auth/api/auth-api';
import { AuthPageLayout } from '../features/auth/components/AuthPageLayout';
import { useAuth } from '../features/auth/use-auth';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(input: RegisterFormValues) {
    setApiError(null);

    try {
      await registerRequest({
        name: input.name,
        email: input.email,
        password: input.password,
      });

      navigate('/login', {
        replace: true,
        state: {
          registrationSuccessful: true,
        },
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
      title="Create your account"
      subtitle="Start organizing your mock interview practice."
    >
      {apiError && <Alert severity="error">{apiError}</Alert>}

      <Stack
        component="form"
        spacing={2}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <TextField
          label="Name"
          autoComplete="name"
          fullWidth
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must contain at least 2 characters',
            },
            maxLength: {
              value: 120,
              message: 'Name is too long',
            },
          })}
        />

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
          autoComplete="new-password"
          fullWidth
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must contain at least 8 characters',
            },
            maxLength: {
              value: 128,
              message: 'Password is too long',
            },
          })}
        />

        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          fullWidth
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Confirm your password',
            validate: (value) =>
              value === getValues('password') || 'Passwords do not match',
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
            'Create account'
          )}
        </Button>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">
          Sign in
        </Link>
      </Typography>
    </AuthPageLayout>
  );
}
