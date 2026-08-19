import { useCallback, useEffect, useState } from 'react';
import { getCourts } from '../../services/adminService';
import { useUI } from '../../contexts/UIContext';
import { SPORT_LABELS } from '../../constants/sports';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import styles from './AdminCourtsPage.module.css';

const PAGE_SIZE = 10;

const columns = [
  { key: 'name', label: 'Nome' },
  {
    key: 'sport',
    label: 'Esporte',
    render: (sport) => <Badge>{SPORT_LABELS[sport] || sport}</Badge>,
  },
  { key: 'location', label: 'Localização' },
];

export default function AdminCourtsPage() {
  const { addToast } = useUI();
  const [courts, setCourts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCourts(await getCourts());
    } catch (err) {
      const message = err?.response?.data?.error?.message || 'Não foi possível carregar as quadras.';
      addToast(message, 'danger');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    load();
  }, [load]);

  // Busca client-side por nome ou localização; a paginação fatia o
  // resultado filtrado (o endpoint de quadras não é paginado).
  const term = search.trim().toLowerCase();
  const filtered = term
    ? courts.filter(
        (court) =>
          court.name?.toLowerCase().includes(term) ||
          court.location?.toLowerCase().includes(term)
      )
    : courts;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  return (
    <div>
      <h1 className={styles.title}>Quadras</h1>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Buscar por nome ou localização..."
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={paginated}
        loading={loading}
        emptyMessage={
          term
            ? 'Nenhuma quadra encontrada para a busca.'
            : 'Nenhuma quadra cadastrada.'
        }
      />

      <div className={styles.pagination}>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
