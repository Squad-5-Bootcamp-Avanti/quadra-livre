import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import NotFoundPage from '../pages/NotFoundPage';

// Páginas — cada integrante cria a sua
// Os imports abaixo serão descomentados conforme o time entrega
// import LandingPage       from '../pages/LandingPage';
import LoginPage         from '../pages/LoginPage';
import RegisterPage      from '../pages/RegisterPage';
// import ProfilePage       from '../pages/ProfilePage';
// import CourtsPage        from '../pages/CourtsPage';
// import CourtDetailPage   from '../pages/CourtDetailPage';
// import ReservationsPage  from '../pages/ReservationsPage';
import AdminDashboard    from '../pages/admin/AdminDashboard';
import AdminUsersPage    from '../pages/admin/AdminUsersPage';
// import AdminCourtsPage   from '../pages/admin/AdminCourtsPage';
import AdminReservations from '../pages/admin/AdminReservationsPage';

// Placeholder temporário para rotas ainda não implementadas
const Placeholder = ({ name }) => (
  <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
    <h2>🚧 {name}</h2>
    <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
      Esta página será implementada pelo integrante responsável.
    </p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>

      {/* ── Rotas públicas com layout principal ── */}
      <Route element={<MainLayout />}>
        <Route index element={<Placeholder name="Landing Page (Int. 6)" />} />
        <Route path="quadras" element={<Placeholder name="Quadras (Int. 3)" />} />
        <Route path="quadras/:id" element={<Placeholder name="Detalhe da Quadra (Int. 3)" />} />
      </Route>

      {/* ── Rotas de autenticação ── */}
      <Route element={<AuthLayout />}>
        <Route path="login"   element={<LoginPage />} />
        <Route path="cadastro" element={<RegisterPage />} />
      </Route>

      {/* ── Rotas protegidas (qualquer usuário logado) ── */}
      <Route element={<MainLayout />}>
        <Route
          path="perfil"
          element={
            <ProtectedRoute>
              <Placeholder name="Perfil (Int. 2)" />
            </ProtectedRoute>
          }
        />
        <Route
          path="reservas"
          element={
            <ProtectedRoute>
              <Placeholder name="Minhas Reservas (Int. 4)" />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── Rotas administrativas (apenas ADMIN) ── */}
      <Route
        path="admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="usuarios"  element={<AdminUsersPage />} />
        <Route path="quadras"   element={<Placeholder name="Gerenciar Quadras (Int. 5)" />} />
        <Route path="reservas"  element={<AdminReservations />} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}