import { Navigate, Outlet, useLocation } from "react-router-dom";

const getRoleFromToken = (token) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return null;
  }
};

const AuthGuard = ({ requiredRole }) => {
  const location = useLocation();
  const token = localStorage.getItem("kostody_token");

  if (!token) {
    if (requiredRole === "ENGINEER") {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (requiredRole === "CUSTOMER") {
      return <Navigate to="/c/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/" replace />;
  }

  const role = getRoleFromToken(token);

  if (role !== requiredRole) {
    if (role === "ENGINEER") {
      return <Navigate to="/app/dashboard" replace />;
    }
    if (role === "CUSTOMER") {
      return <Navigate to="/c/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
