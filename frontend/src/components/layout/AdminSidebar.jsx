import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../common/Avatar';
import styles from './AdminSidebar.module.css';

const NAV_ITEMS = [
  { to: '/admin',          label: 'Dashboard',  icon: '📊', end: true },
  { to: '/admin/usuarios', label: 'Usuários',   icon: '👥' },
  { to: '/admin/quadras',  label: 'Quadras',    icon: '🏟️' },
  { to: '/admin/reservas', label: 'Reservas',   icon: '📅' },
];

export default function AdminSidebar() {
  const { user } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>⚽</span>
        <span className={styles.brandText}>QuadraLivre</span>
      </div>

      <nav className={styles.nav} aria-label="Menu administrativo">
        {NAV_ITEMS.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => [styles.navItem, isActive ? styles.active : ''].join(' ')}
          >
            <span className={styles.navIcon}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <Avatar name={user?.name} size="sm" />
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user?.name}</span>
          <span className={styles.userRole}>Administrador</span>
        </div>
      </div>
    </aside>
  );
}
