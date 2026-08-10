import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <span className={styles.brand}>⚽ QuadraLivre</span>
        <span className={styles.copy}>© 2026 · Squad 05 · Atlântico Avanti</span>
      </div>
    </footer>
  );
}
