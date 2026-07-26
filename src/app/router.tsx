import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CandidatesPage } from '../pages/CandidatesPage';
import { InterviewsPage } from '../pages/InterviewsPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/candidates',
            element: <CandidatesPage />,
          },
          {
            path: '/interviews',
            element: <InterviewsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
