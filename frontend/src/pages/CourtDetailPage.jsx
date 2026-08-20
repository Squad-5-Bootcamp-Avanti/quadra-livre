import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { getCourtById } from '../services/courtService';
import { createReservation, getReservations } from '../services/reservationService'; 
import { SPORT_LABELS } from '../constants/sports';
import { useAuth } from '../contexts/AuthContext'; 
import { useUI } from '../contexts/UIContext'; 
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal'; 
import Input from '../components/common/Input'; 
import Button from '../components/common/Button'; 
import styles from './CourtDetailPage.module.css';

export default function CourtDetailPage() {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth(); // Pega o usuário logado
  const { addToast } = useUI(); // Pega a função de Toasts

  // Controle do Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Controle de Disponibilidade Real-Time
  const [occupiedReservations, setOccupiedReservations] = useState([]);
  const [loadingOccupied, setLoadingOccupied] = useState(false);
  
  // Controle de Envio
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // 1. Efeito para verificar a disponibilidade em tempo real
  useEffect(() => {
    if (!date || !id) {
      setOccupiedReservations([]);
      return;
    }

    async function checkAvailability() {
      setLoadingOccupied(true);
      try {
        const data = await getReservations({ courtId: id, date });
        setOccupiedReservations(data);
      } catch (err) {
        console.error('Erro ao verificar horários ocupados:', err);
      } finally {
        setLoadingOccupied(false);
      }
    }

    checkAvailability();
  }, [date, id]);

  // 2. Efeito para carregar os dados da quadra
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

  // 3. Função para enviar a nova reserva ao servidor
  async function handleBookingSubmit(event) {
    event.preventDefault();
    setFormErrors({});

    const errors = {};
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    // Validações Locais (Frontend)
    if (!date) errors.date = 'Selecione uma data.';
    else if (date < todayStr) errors.date = 'Você não pode reservar em uma data que já passou.';

    if (!startTime) errors.startTime = 'Horário de início obrigatório.';
    if (!endTime) errors.endTime = 'Horário de término obrigatório.';
    else if (startTime >= endTime) {
      errors.endTime = 'O término deve ser após o horário de início.';
    }

    // Se a reserva for para hoje, garante que o horário de início não é no passado
    if (date === todayStr && startTime) {
      const currentHours = String(today.getHours()).padStart(2, '0');
      const currentMinutes = String(today.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      if (startTime < currentTimeStr) {
        errors.startTime = 'O horário de início não pode ser no passado.';
      }
    }

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    // Envio para o Servidor
    setSaving(true);
    try {
      await createReservation({
        playerId: user.id, // ID do jogador logado
        courtId: id,       // ID da quadra
        date,
        startTime,
        endTime,
      });

      addToast('Reserva agendada com sucesso!');
      setIsModalOpen(false);
      navigate('/reservas'); // Redireciona para o painel de reservas!
    } catch (err) {
      const code = err?.response?.data?.error?.code;
      const message = err?.response?.data?.error?.message || 'Erro ao realizar reserva.';

      if (code === 'RESERVATION_CONFLICT') {
        // Erro específico de colisão de horários
        setFormErrors({
          startTime: 'Conflito de horários.',
          endTime: 'Já existe um jogo agendado neste horário para esta quadra.',
        });
      } else {
        addToast(message, 'danger');
      }
    } finally {
      setSaving(false);
    }
  }

  // 4. Verificações de telas de carregamento/erro (devem vir antes do return principal)
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

  // 5. Renderização da interface (o HTML/JSX)
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

        {/* Substituído o link por um botão de ação com o design do CTA */}
        <div className={styles.actions}>
          <Button onClick={() => setIsModalOpen(true)} className={styles.cta}>
            Reservar esta quadra
          </Button>
        </div>
      </div>

      {/* Modal de Agendamento */}
      <Modal
        open={isModalOpen}
        onClose={saving ? () => {} : () => setIsModalOpen(false)}
        title={`Reservar - ${court.name}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="booking-form" loading={saving}>
              Confirmar Reserva
            </Button>
          </>
        }
      >
        <form id="booking-form" className={styles.form} onSubmit={handleBookingSubmit}>
          <Input
            label="Data da Reserva"
            type="date"
            required
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setFormErrors((prev) => ({ ...prev, date: undefined }));
            }}
            error={formErrors.date}
          />

          <div className={styles.timeRow}>
            <Input
              label="Início"
              type="time"
              required
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setFormErrors((prev) => ({ ...prev, startTime: undefined }));
              }}
              error={formErrors.startTime}
            />
            <Input
              label="Término"
              type="time"
              required
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setFormErrors((prev) => ({ ...prev, endTime: undefined }));
              }}
              error={formErrors.endTime}
            />
          </div>
        </form>

        {/* Seção Real-Time de disponibilidade */}
        {date && (
          <div className={styles.availabilitySection}>
            <h4>Horários já reservados em {date}:</h4>
            {loadingOccupied ? (
              <p>Verificando disponibilidade...</p>
            ) : occupiedReservations.length === 0 ? (
              <p className={styles.availableText}>🎉 Quadra totalmente livre nesta data!</p>
            ) : (
              <ul className={styles.occupiedList}>
                {occupiedReservations.map((res) => (
                  <li key={res.id}>
                    🚫 Das {res.startTime} às {res.endTime}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
