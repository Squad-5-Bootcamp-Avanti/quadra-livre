import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCourts } from '../services/courtService';
import { SPORT_OPTIONS } from '../constants/sports';
import CourtCard from '../components/courts/CourtCard';
import SearchBar from '../components/common/SearchBar';
import Select from '../components/common/Select';
import Loading from '../components/common/Loading';
import styles from './CourtsPage.module.css';

export default function CourtsPage() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCourts(await getCourts());
    } catch (err) {
      const message = err?.response?.data?.error?.message || 'Não foi possível carregar as quadras.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courts.filter((court) => {
      const matchesTerm =
        !term ||
        court.name?.toLowerCase().includes(term) ||
        court.location?.toLowerCase().includes(term);
      const matchesSport = !sport || court.sport === sport;
      return matchesTerm && matchesSport;
    });
  }, [courts, search, sport]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Quadras disponíveis</h1>
      <p className={styles.subtitle}>Encontre a quadra ideal para o seu esporte.</p>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nome ou localização..."
          />
        </div>
        <div className={styles.filter}>
          <Select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            options={SPORT_OPTIONS}
            placeholder="Todos os esportes"
          />
        </div>
      </div>

      {loading && <Loading text="Carregando quadras..." />}

      {!loading && error && (
        <p role="alert" className={styles.error}>{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className={styles.empty}>
          {courts.length === 0
            ? 'Nenhuma quadra cadastrada no momento.'
            : 'Nenhuma quadra encontrada para os filtros selecionados.'}
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      )}
    </div>
  );
}
