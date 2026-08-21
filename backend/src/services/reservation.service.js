const reservationRepository = require('../repositories/reservation.repository');
const playerRepository = require('../repositories/player.repository');
const courtRepository = require('../repositories/court.repository');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildMeta } = require('../utils/pagination');

// ── Helpers de conversão ──────────────────────────────────────
// O Prisma armazena `date` como @db.Date e `startTime`/`endTime`
// como @db.Time. Para evitar problemas de fuso horário, sempre
// construímos os valores em UTC explicitamente.

function parseDateOnly(dateString) {
  // dateString esperado: "AAAA-MM-DD"
  return new Date(`${dateString}T00:00:00.000Z`);
}

function parseTimeOnly(timeString) {
  // timeString esperado: "HH:mm" — usamos uma data-base fixa,
  // já que só o horário importa para comparação.
  return new Date(`1970-01-01T${timeString}:00.000Z`);
}

function formatDateOnly(date) {
  if (!date) return '';
  if (typeof date === 'string') {
    return date.slice(0, 10);
  }
  try {
    return date.toISOString().slice(0, 10);
  } catch (e) {
    return '';
  }
}

function formatTimeOnly(date) {
  if (!date) return '';
  if (typeof date === 'string') {
    return date.slice(0, 5);
  }
  try {
    return date.toISOString().slice(11, 16);
  } catch (e) {
    return '';
  }
}

// Combina data + horário (mesma convenção UTC usada acima) e verifica
// se o instante resultante já ficou no passado em relação a agora.
// Usado para impedir criação de reservas retroativas direto pela API,
// já que o formulário do frontend só valida isso client-side.
function isPastDateTime(dateString, timeString) {
  const bookingMoment = new Date(`${dateString}T${timeString}:00.000Z`);
  return bookingMoment.getTime() < Date.now();
}

// ── Service ────────────────────────────────────────────────────

const reservationService = {
  list: async ({ courtId, date, playerId, page, limit } = {}) => {
    const filters = {};
    if (courtId) filters.courtId = courtId;
    if (date) filters.date = parseDateOnly(date);
    if (playerId) filters.playerId = playerId;

    // Sem `page`/`limit` na query, mantém o comportamento original
    // (array completo, sem meta), preservando os consumidores atuais.
    if (page === undefined && limit === undefined) {
      const reservations = await reservationRepository.findAll(filters);
      return { data: reservations.map(reservationService.serialize) };
    }

    const pagination = parsePagination({ page, limit });
    const [reservations, total] = await reservationRepository.findPage(filters, pagination);

    return {
      data: reservations.map(reservationService.serialize),
      meta: buildMeta({ total, page: pagination.page, limit: pagination.limit }),
    };
  },

  /**
   * Lista apenas os horários já ocupados de uma quadra numa data —
   * usado pela tela de disponibilidade em tempo real (CourtDetailPage).
   * Propositalmente NÃO filtra por jogador (precisa enxergar reservas
   * de todos os usuários para mostrar a disponibilidade real) e NÃO
   * expõe nenhum dado pessoal de quem reservou (sem incluir `player`),
   * para não vazar PII de outros usuários pela consulta de disponibilidade.
   */
  listOccupiedSlots: async ({ courtId, date }) => {
    if (!courtId || !date) {
      throw ApiError.badRequest(
        'courtId e date são obrigatórios para consultar disponibilidade.',
        'MISSING_FIELDS'
      );
    }

    const parsedDate = parseDateOnly(date);
    const slots = await reservationRepository.findOccupiedSlots({ courtId, date: parsedDate });

    return slots.map((slot) => ({
      id: slot.id,
      startTime: formatTimeOnly(slot.startTime),
      endTime: formatTimeOnly(slot.endTime),
    }));
  },

  getById: async (id) => {
    const reservation = await reservationRepository.findById(id);
    if (!reservation) {
      throw ApiError.notFound('Reserva não encontrada.');
    }
    return reservationService.serialize(reservation);
  },

  create: async (payload) => {
    const { playerId, courtId, date, startTime, endTime } = payload;

    if (startTime >= endTime) {
      throw ApiError.badRequest(
        'O horário de início deve ser anterior ao horário de fim.',
        'INVALID_TIME_RANGE'
      );
    }

    if (isPastDateTime(date, startTime)) {
      throw ApiError.badRequest(
        'Não é possível criar uma reserva em uma data/horário que já passou.',
        'PAST_DATE_TIME'
      );
    }

    const player = await playerRepository.findById(playerId);
    if (!player) {
      throw ApiError.notFound('Jogador informado não existe.', 'PLAYER_NOT_FOUND');
    }

    const court = await courtRepository.findById(courtId);
    if (!court) {
      throw ApiError.notFound('Quadra informada não existe.', 'COURT_NOT_FOUND');
    }

    const parsedDate = parseDateOnly(date);
    const parsedStart = parseTimeOnly(startTime);
    const parsedEnd = parseTimeOnly(endTime);

    await reservationService.assertNoConflict({
      courtId,
      date: parsedDate,
      startTime: parsedStart,
      endTime: parsedEnd,
      courtName: court.name,
      dateLabel: date,
      startLabel: startTime,
      endLabel: endTime,
    });

    const created = await reservationRepository.create({
      playerId,
      courtId,
      date: parsedDate,
      startTime: parsedStart,
      endTime: parsedEnd,
    });

    return reservationService.serialize(created);
  },

  update: async (id, data) => {
    const existing = await reservationRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Reserva não encontrada.');
    }

    const finalData = {
      playerId: data.playerId || existing.playerId,
      courtId: data.courtId || existing.courtId,
      date: data.date || formatDateOnly(existing.date),
      startTime: data.startTime || formatTimeOnly(existing.startTime),
      endTime: data.endTime || formatTimeOnly(existing.endTime),
    };

    const { playerId, courtId, date, startTime, endTime } = finalData;

    if (startTime >= endTime) {
      throw ApiError.badRequest(
        'O horário de início deve ser anterior ao horário de fim.',
        'INVALID_TIME_RANGE'
      );
    }

    // Otimização: busca jogador e quadra em paralelo, se necessário.
    const [player, court] = await Promise.all([
      data.playerId ? playerRepository.findById(data.playerId) : Promise.resolve(true),
      data.courtId ? courtRepository.findById(data.courtId) : Promise.resolve(existing.court),
    ]);

    if (!player) {
      throw ApiError.notFound('Jogador informado não existe.', 'PLAYER_NOT_FOUND');
    }
    if (!court) {
      throw ApiError.notFound('Quadra informada não existe.', 'COURT_NOT_FOUND');
    }

    const parsedDate = parseDateOnly(date);
    const parsedStart = parseTimeOnly(startTime);
    const parsedEnd = parseTimeOnly(endTime);

    await reservationService.assertNoConflict({
      courtId,
      date: parsedDate,
      startTime: parsedStart,
      endTime: parsedEnd,
      excludeId: id,
      courtName: court.name,
      dateLabel: date,
      startLabel: startTime,
      endLabel: endTime,
    });

    const updated = await reservationRepository.update(id, {
      playerId,
      courtId,
      date: parsedDate,
      startTime: parsedStart,
      endTime: parsedEnd,
    });

    return reservationService.serialize(updated);
  },

  remove: async (id) => {
    const existing = await reservationRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Reserva não encontrada.');
    }
    return reservationRepository.remove(id);
  },

  /**
   * Regra de negócio central do sistema: lança HTTP 409 se
   * existir qualquer reserva sobreposta na mesma quadra/data.
   */
  assertNoConflict: async ({
    courtId,
    date,
    startTime,
    endTime,
    excludeId,
    courtName,
    dateLabel,
    startLabel,
    endLabel,
  }) => {
    const conflicts = await reservationRepository.findConflicts({
      courtId,
      date,
      startTime,
      endTime,
      excludeId,
    });

    if (conflicts.length > 0) {
      throw ApiError.conflict(
        `Já existe uma reserva para a quadra "${courtName}" em ${dateLabel} que ` +
        `sobrepõe o horário ${startLabel}–${endLabel}.`,
        'RESERVATION_CONFLICT'
      );
    }
  },

  /**
   * Converte os campos `date`/`startTime`/`endTime` (objetos Date
   * vindos do Prisma) para strings simples ("AAAA-MM-DD", "HH:mm")
   * antes de devolver ao frontend.
   */
  serialize: (reservation) => ({
    ...reservation,
    date: formatDateOnly(reservation.date),
    startTime: formatTimeOnly(reservation.startTime),
    endTime: formatTimeOnly(reservation.endTime),
  }),
};

module.exports = reservationService;
