import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const roleRedirects: Record<string, string> = {
  candidate: "/talent/dashboard",
  company: "/company/dashboard",
  admin: "/admin",
};

const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/login/talent" }: ProtectedRouteProps) => {
  const { user, role, loading, company } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground font-mono text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Cross-role redirect: if logged in but wrong role, send to their dashboard
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const target = roleRedirects[role] || "/";
    return <Navigate to={target} replace />;
  }

  // Company pending check
  if (role === "company" && company?.status === "pending") {
    return <Navigate to="/auth/company-pending" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
