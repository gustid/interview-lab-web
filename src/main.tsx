import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import theme from './app/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import router from './app/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
