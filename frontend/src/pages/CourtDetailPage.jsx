import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourtById } from '../services/courtService';
import { SPORT_LABELS } from '../constants/sports';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import styles from './CourtDetailPage.module.css';

export default function CourtDetailPage() {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      setNotFound(false);
      try {
        const data = await getCourtById(id);
        if (active) setCourt(data);
      } catch (err) {
        if (!active) return;
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          const message = err?.response?.data?.error?.message || 'Não foi possível carregar a quadra.';
          setError(message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <Loading fullScreen text="Carregando quadra..." />;
  }

  if (notFound) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Quadra não encontrada.</p>
        <Link to="/quadras" className={styles.back}>
          ← Voltar para quadras
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p role="alert" className={styles.error}>{error}</p>
        <Link to="/quadras" className={styles.back}>
          ← Voltar para quadras
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/quadras" className={styles.back}>
        ← Voltar para quadras
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.name}>{court.name}</h1>
          <Badge>{SPORT_LABELS[court.sport] || court.sport}</Badge>
        </div>

        <p className={styles.location}>
          <span aria-hidden="true">📍</span> {court.location}
        </p>

        <div className={styles.actions}>
          <Link to="/reservas" className={styles.cta}>
            Reservar esta quadra
          </Link>
        </div>
      </div>
    </div>
  );
}
