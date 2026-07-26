import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CandidatesPage } from '../pages/CandidatesPage';
import { CreateCandidatePage } from '../pages/CreateCandidatePage';
import { CandidateDetailsPage } from '../pages/CandidateDetailsPage';
import { EditCandidatePage } from '../pages/EditCandidatePage';
import { InterviewsPage } from '../pages/InterviewsPage';
import { CreateInterviewPage } from '../pages/CreateInterviewPage';
import { InterviewDetailsPage } from '../pages/InterviewDetailsPage';
import { EditInterviewPage } from '../pages/EditInterviewPage';
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
            path: '/candidates/new',
            element: <CreateCandidatePage />,
          },
          {
            path: '/candidates/:id',
            element: <CandidateDetailsPage />,
          },
          {
            path: '/candidates/:id/edit',
            element: <EditCandidatePage />,
          },
          {
            path: '/interviews',
            element: <InterviewsPage />,
          },
          {
            path: '/interviews/new',
            element: <CreateInterviewPage />,
          },
          {
            path: '/interviews/:id',
            element: <InterviewDetailsPage />,
          },
          {
            path: '/interviews/:id/edit',
            element: <EditInterviewPage />,
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
