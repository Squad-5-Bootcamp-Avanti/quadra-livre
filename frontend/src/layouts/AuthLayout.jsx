import { Outlet, Link } from 'react-router-dom';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.panel}>
        <Link to="/" className={styles.logo}>
          <span>⚽</span>
          <span>Quadra<strong>Livre</strong></span>
        </Link>
        <Outlet />
      </div>
      <div className={styles.cover} aria-hidden="true">
        <div className={styles.coverContent}>
          <h2 className={styles.coverTitle}>Reserve sua quadra em segundos.</h2>
          <p className={styles.coverSub}>Sem conflitos, sem cadernos. Só esporte.</p>
        </div>
      </div>
    </div>
  );
}
