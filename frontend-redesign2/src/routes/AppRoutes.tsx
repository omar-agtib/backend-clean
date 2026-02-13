// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import BootPage from "../pages/BootPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProjectsPage from "../pages/ProjectsPage";
import ProjectWorkspacePage from "../pages/ProjectWorkspacePage";
import NotificationsPage from "../pages/NotificationsPage";
import RequireAuth from "./RequireAuth";
import AppLayout from "../layouts/AppLayout";
import SearchPage from "../pages/SearchPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BootPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route
            path="projects/:projectId"
            element={<ProjectWorkspacePage />}
          />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="search" element={<SearchPage />} />

          <Route
            path="stock"
            element={<Navigate to="/app/projects" replace />}
          />
          <Route
            path="tools"
            element={<Navigate to="/app/projects" replace />}
          />
          <Route
            path="billing"
            element={<Navigate to="/app/projects" replace />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
