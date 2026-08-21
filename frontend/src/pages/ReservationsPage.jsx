import { useEffect, useState } from 'react';
import { getReservations, cancelReservation } from '../services/reservationService';
import { SPORT_LABELS } from '../constants/sports';
import { useUI } from '../contexts/UIContext';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import styles from './ReservationsPage.module.css';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToast } = useUI();
  const [deleting, setDeleting] = useState(null);
  const [removing, setRemoving] = useState(false);

  // 1. Carrega as reservas no início
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const data = await getReservations();
        setReservations(data);
      } catch (err) {
        const msg = err?.response?.data?.error?.message || 'Erro ao carregar reservas.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // 2. Função acionada ao confirmar o cancelamento
  async function handleCancelReservation() {
    if (!deleting) return;
    
    setRemoving(true);
    try {
      await cancelReservation(deleting.id);
      addToast('Reserva cancelada com sucesso.');
      
      // Remove da nossa lista local instantaneamente
      setReservations((prev) => prev.filter((res) => res.id !== deleting.id));
      setDeleting(null);
    } catch (err) {
      const message = err?.response?.data?.error?.message || 'Não foi possível cancelar a reserva.';
      addToast(message, 'danger');
    } finally {
      setRemoving(false);
    }
  }

  const now = new Date();

  // 3. Filtros de ativas e passadas
  const activeReservations = reservations.filter((res) => {
    const resDateTime = new Date(`${res.date}T${res.startTime}`);
    return resDateTime >= now;
  });

  const pastReservations = reservations.filter((res) => {
    const resDateTime = new Date(`${res.date}T${res.startTime}`);
    return resDateTime < now;
  });

  if (loading) {
    return <Loading fullScreen text="Carregando suas reservas..." />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  // 4. Renderização do HTML (JSX)
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Minhas Reservas</h1>

      {/* Seção de Próximos Jogos */}
      <section className={styles.section}>
        <h2 className={styles.sectionSubtitle}>Próximos Jogos</h2>
        {activeReservations.length === 0 ? (
          <p className={styles.emptyText}>Você não tem nenhum jogo agendado.</p>
        ) : (
          <div className={styles.grid}>
            {activeReservations.map((res) => (
              <div key={res.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{res.court.name}</h3>
                  <Badge>{SPORT_LABELS[res.court.sport] || res.court.sport}</Badge>
                </div>
                <div className={styles.cardBody}>
                  <p>📍 {res.court.location}</p>
                  <p>📅 {res.date} (das {res.startTime} às {res.endTime})</p>
                </div>
                {/* Substituído o comentário pelo botão com a classe de estilo */}
                <div className={styles.cardActions}>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => setDeleting(res)}
                  >
                    Cancelar Reserva
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seção do Histórico */}
      <section className={styles.section}>
        <h2 className={styles.sectionSubtitle}>Histórico de Partidas</h2>
        {pastReservations.length === 0 ? (
          <p className={styles.emptyText}>Nenhuma partida jogada anteriormente.</p>
        ) : (
          <div className={styles.grid}>
            {pastReservations.map((res) => (
              <div key={res.id} className={`${styles.card} ${styles.pastCard}`}>
                <div className={styles.cardHeader}>
                  <h3>{res.court.name}</h3>
                  <Badge type="secondary">{SPORT_LABELS[res.court.sport] || res.court.sport}</Badge>
                </div>
                <div className={styles.cardBody}>
                  <p>📍 {res.court.location}</p>
                  <p>📅 {res.date} (das {res.startTime} às {res.endTime})</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* O ConfirmDialog renderizado antes de fechar a div principal */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleCancelReservation}
        title="Cancelar Reserva"
        message={`Deseja realmente cancelar a sua reserva na quadra "${deleting?.court?.name}" marcada para o dia ${deleting?.date} às ${deleting?.startTime}?`}
        confirmLabel="Cancelar Reserva"
        loading={removing}
        danger
      />
    </div>
  );
}
