import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Navigate } from "react-router-dom";
import HomePage from "../../features/home/pages/HomePage";
import { ProfilePage } from "../../features/profile/pages/ProfilePage";
import { SettingsPage } from "../../features/settings/pages/SettingsPage";
import AnalyticsPage from "../../features/analytics/pages/AnalyticsPage";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { RegisterPage } from "../../features/auth/pages/RegisterPage";
import { QuizResultPage } from "../../features/quizzes/pages/QuizResultPage";
import { LibraryPage } from "../../features/containers/pages/LibraryPage";
import { ReviewsPage } from "../../features/reviews/pages/ReviewsPage";
import { QuizzesPage } from "../../features/quizzes/pages/QuizzesPage";
import { ContainerPage } from "../../features/containers/pages/ContainerPage";
import { LessonPage } from "../../features/lessons/pages/LessonPage";
import { CreateLessonPage } from "../../features/lessons/pages/CreateLessonPage";
import { LessonWorkspacePage } from "../../features/lessons/pages/LessonWorkspacePage";
import { SummaryPage } from "../../features/summaries/pages/SummaryPage";
import { QuizPage } from "../../features/quizzes/pages/QuizPage";
import { AskPage } from "../../features/ask/pages/AskPage";
import { QuizTakePage } from "../../features/quizzes/pages/QuizTakePage";
import { ReviewSessionPage } from "../../features/reviews/pages/ReviewSessionPage";
import { SummariesPage } from "../../features/summaries/pages/SummariesPage";
import SearchPage from "../../features/search/pages/SearchPage";

export const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <LoginPage />,
  },

  {
    path: "/auth/register",
    element: <RegisterPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/library",
            element: <LibraryPage />,
          },
          {
            path: "/reviews",
            element: <ReviewsPage />,
          },
          {
            path: "analytics",
            element: <AnalyticsPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
          {
            path: "/containers",
            element: <Navigate to="/library" replace />,
          },
          { path: "containers/:containerId", element: <ContainerPage /> },
          {
            path: "containers/:containerId/lessons/:lessonId",
            element: <LessonPage />,
          },
          {
            path: "/containers/:containerId/lessons/new",
            element: <CreateLessonPage />,
          },
          {
            path: "/containers/:containerId/lessons/:lessonId",
            element: <LessonWorkspacePage />,
          },
          {
            path: "containers/:containerId/lessons/:lessonId/summary",
            element: <SummaryPage />,
          },
          {
            path: "containers/:containerId/lessons/:lessonId/summaries",
            element: <SummariesPage />,
          },
          {
            path: "/containers/:containerId/lessons/:lessonId/quiz",
            element: <QuizPage />,
          },
          {
            path: "/containers/:containerId/lessons/:lessonId/quiz/:quizId",
            element: <QuizTakePage />,
          },
          {
            path: "/containers/:containerId/lessons/:lessonId/quiz/:quizId/result",
            element: <QuizResultPage />,
          },
          {
            path: "/containers/:containerId/lessons/:lessonId/quizzes",
            element: <QuizzesPage />,
          },
          {
            path: "/containers/:containerId/lessons/:lessonId/ask",
            element: <AskPage />,
          },
          {
            path: "/containers/:containerId/lessons/:lessonId/review",
            element: <ReviewSessionPage />,
          },
          {
            path: "search",
            element: <SearchPage />,
          },
        ],
      },
    ],
  },
]);
