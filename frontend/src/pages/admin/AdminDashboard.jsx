import { useEffect, useState } from 'react';
import { getStats, getReservations } from '../../services/adminService';
import { useUI } from '../../contexts/UIContext';
import StatCard from '../../components/common/StatCard';
import Table from '../../components/common/Table';
import { formatDate } from '../../utils/format';
import styles from './AdminDashboard.module.css';

const columns = [
  { key: 'player', label: 'Jogador', render: (player) => player?.name || '' },
  { key: 'court', label: 'Quadra', render: (court) => court?.name || '' },
  { key: 'date', label: 'Data', render: (date) => formatDate(date) },
  { key: 'startTime', label: 'Horário', render: (startTime, row) => `${startTime} às ${row.endTime}` },
];

export default function AdminDashboard() {
  const { addToast } = useUI();
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setStats(await getStats());
      } catch (err) {
        const message = err?.response?.data?.error?.message || 'Não foi possível carregar os totais.';
        addToast(message, 'danger');
      } finally {
        setLoadingStats(false);
      }
    }

    async function loadReservations() {
      try {
        const { data } = await getReservations({ limit: 5 });
        setReservations(data);
      } catch (err) {
        const message = err?.response?.data?.error?.message || 'Não foi possível carregar as últimas reservas.';
        addToast(message, 'danger');
      } finally {
        setLoadingReservations(false);
      }
    }

    loadStats();
    loadReservations();
  }, [addToast]);

  return (
    <div>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.stats}>
        <StatCard label="Reservas" value={stats?.totalReservations ?? 0} loading={loadingStats} />
        <StatCard label="Usuários" value={stats?.totalPlayers ?? 0} loading={loadingStats} />
        <StatCard label="Quadras" value={stats?.totalCourts ?? 0} loading={loadingStats} />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Últimas reservas</h2>
        <Table
          columns={columns}
          data={reservations}
          loading={loadingReservations}
          emptyMessage="Nenhuma reserva registrada ainda."
        />
      </section>
    </div>
  );
}
