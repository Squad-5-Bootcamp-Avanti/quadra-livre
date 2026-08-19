import { useEffect, useState } from 'react';
import { getReservations } from '../../services/adminService';
import { useUI } from '../../contexts/UIContext';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/format';
import styles from './AdminReservationsPage.module.css';

const PAGE_SIZE = 10;

const columns = [
  { key: 'player', label: 'Jogador', render: (player) => player?.name || '' },
  { key: 'court', label: 'Quadra', render: (court) => court?.name || '' },
  { key: 'date', label: 'Data', render: (date) => formatDate(date) },
  { key: 'startTime', label: 'Início' },
  { key: 'endTime', label: 'Fim' },
];

export default function AdminReservationsPage() {
  const { addToast } = useUI();
  const [reservations, setReservations] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await getReservations({
          page,
          limit: PAGE_SIZE,
          date: date || undefined,
        });
        setReservations(result.data);
        setMeta(result.meta);
      } catch (err) {
        const message = err?.response?.data?.error?.message || 'Não foi possível carregar as reservas.';
        addToast(message, 'danger');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, date, addToast]);

  function handleDateChange(event) {
    setDate(event.target.value);
    setPage(1);
  }

  function clearFilter() {
    setDate('');
    setPage(1);
  }

  return (
    <div>
      <h1 className={styles.title}>Reservas</h1>

      <div className={styles.toolbar}>
        <Input
          label="Filtrar por data"
          type="date"
          value={date}
          onChange={handleDateChange}
        />
        {date && (
          <Button variant="ghost" size="sm" onClick={clearFilter}>
            Limpar filtro
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={reservations}
        loading={loading}
        emptyMessage={
          date
            ? 'Nenhuma reserva para a data selecionada.'
            : 'Nenhuma reserva registrada ainda.'
        }
      />

      {meta && (
        <div className={styles.pagination}>
          <Pagination page={page} totalPages={meta.totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
