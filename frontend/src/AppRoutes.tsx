// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import BootPage from "./pages/BootPage";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectWorkspacePage from "./pages/ProjectWorkspacePage";
import NotificationsPage from "./pages/NotificationsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BootPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />

        {/* Projects */}
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectWorkspacePage />} />

        {/* Notifications */}
        <Route path="notifications" element={<NotificationsPage />} />

        {/* later */}
        <Route path="stock" element={<div>Stock page (later)</div>} />
        <Route path="tools" element={<div>Tools page (later)</div>} />
        <Route path="billing" element={<div>Billing page (later)</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
