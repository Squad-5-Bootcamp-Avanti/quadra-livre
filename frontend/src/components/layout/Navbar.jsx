import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isLogged, isAdmin, logout } = useAuth();
  const { addToast } = useUI();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Você saiu da conta.', 'info');
    navigate('/');
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} aria-label="Quadra Livre - Início">
          <span className={styles.logoIcon}>⚽</span>
          <span className={styles.logoText}>Quadra<strong>Livre</strong></span>
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          <Link to="/quadras" className={styles.navLink}>Quadras</Link>
          {isLogged && <Link to="/reservas" className={styles.navLink}>Minhas Reservas</Link>}
          {isAdmin  && <Link to="/admin"    className={styles.navLink}>Admin</Link>}
        </nav>

        <div className={styles.actions}>
          {isLogged ? (
            <div className={styles.userMenu}>
              <Link to="/perfil" className={styles.userInfo}>
                <Avatar name={user?.name} size="sm" />
                <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Sair</Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Entrar</Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/cadastro')}>Cadastrar</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
