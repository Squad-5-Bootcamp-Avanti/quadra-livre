import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { SPORT_LABELS } from '../../constants/sports';
import styles from './CourtCard.module.css';

export default function CourtCard({ court }) {
  return (
    <Link to={`/quadras/${court.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.name}>{court.name}</h3>
          <Badge>{SPORT_LABELS[court.sport] || court.sport}</Badge>
        </div>
        <p className={styles.location}>
          <span aria-hidden="true">📍</span> {court.location}
        </p>
      </Card>
    </Link>
  );
}
