import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoadingPage from "../pages/LoadingPage";
import LoginPage from "../pages/LoginPage";
import ProjectsPage from "../pages/ProjectsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LoadingPage /> }, // boot screen → checks auth
      { path: "login", element: <LoginPage /> },
      { path: "projects", element: <ProjectsPage /> },
      // next later: dashboard, projects, etc...
    ],
  },
]);
