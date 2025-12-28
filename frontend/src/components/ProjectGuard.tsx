import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProjectStore } from "../store/projectStore";


export default function ProjectGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeProjectId = useProjectStore((s) => s.activeProjectId);

  useEffect(() => {
    // Allow /app/projects always
    if (location.pathname.startsWith("/app/projects")) return;

    if (!activeProjectId) {
      navigate("/app/projects", { replace: true });
    }
  }, [activeProjectId, location.pathname, navigate]);

  if (!activeProjectId) return null;
  return <>{children}</>;
}
