import axios from 'axios';

interface ApiErrorResponse {
  message?: string | string[];
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return 'Something went wrong. Please try again.';
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join('. ');
  }

  if (typeof message === 'string') {
    return message;
  }

  return 'Unable to connect to the server.';
}
