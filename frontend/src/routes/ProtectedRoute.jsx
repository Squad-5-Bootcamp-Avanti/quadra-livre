import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';

/**
 * Protege rotas por autenticação e/ou role.
 *
 * Uso:
 * <ProtectedRoute />                  → qualquer usuário logado
 * <ProtectedRoute requiredRole="ADMIN" /> → apenas admins
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading fullScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
