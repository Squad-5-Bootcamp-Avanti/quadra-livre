// Rótulos em português para o enum SportType do backend
export const SPORT_LABELS = {
  SOCCER: 'Futebol',
  FUTSAL: 'Futsal',
  VOLLEYBALL: 'Vôlei',
  BASKETBALL: 'Basquete',
  TENNIS: 'Tênis',
  BEACH_TENNIS: 'Beach Tennis',
  OTHER: 'Outro',
};

export const SPORT_OPTIONS = Object.entries(SPORT_LABELS).map(([value, label]) => ({
  value,
  label,
}));
