import { Navigate } from 'react-router-dom';

/**
 * Higher-order component to protect routes based on user role
 *
 * Usage:
 * <RequireRole allowedRoles={[ROLES.WHOLESALE_SELLER, ROLES.ADMIN]}>
 *   <YourComponent />
 * </RequireRole>
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Array<string>} props.allowedRoles - Array of roles allowed to access this route
 * @returns {React.ReactNode} Children if authorized, redirect otherwise
 */
export const RequireRole = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('user_role');

  if (!userRole) {
    // No role in localStorage - redirect to login
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Role not authorized - redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // Role authorized - render children
  return children;
};
