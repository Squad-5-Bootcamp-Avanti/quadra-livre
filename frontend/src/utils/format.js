// Converte datas "AAAA-MM-DD" (formato da API) para "DD/MM/AAAA".
export function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}
