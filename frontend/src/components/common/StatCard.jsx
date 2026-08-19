import Card from './Card';
import Loading from './Loading';
import styles from './StatCard.module.css';

export default function StatCard({ label, value, icon, loading = false }) {
  return (
    <Card className={styles.statCard}>
      <div className={styles.info}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {loading ? <Loading size="sm" text="" /> : value}
        </span>
      </div>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </Card>
  );
}
