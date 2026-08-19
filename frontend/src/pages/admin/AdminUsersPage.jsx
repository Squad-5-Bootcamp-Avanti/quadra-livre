import { useEffect, useState } from 'react';
import { getPlayers } from '../../services/adminService';
import { useUI } from '../../contexts/UIContext';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import styles from './AdminUsersPage.module.css';

const PAGE_SIZE = 10;

const columns = [
  {
    key: 'name',
    label: 'Nome',
    render: (name) => (
      <span className={styles.user}>
        <Avatar name={name} size="sm" />
        <span>{name}</span>
      </span>
    ),
  },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Telefone' },
  {
    key: 'role',
    label: 'Perfil',
    render: (role) => (
      <Badge variant={role === 'ADMIN' ? 'primary' : 'default'}>{role}</Badge>
    ),
  },
];

export default function AdminUsersPage() {
  const { addToast } = useUI();
  const [players, setPlayers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await getPlayers({ page, limit: PAGE_SIZE });
        setPlayers(result.data);
        setMeta(result.meta);
      } catch (err) {
        const message = err?.response?.data?.error?.message || 'Não foi possível carregar os usuários.';
        addToast(message, 'danger');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, addToast]);

  // Busca client-side sobre a página carregada, por nome ou email.
  const term = search.trim().toLowerCase();
  const filtered = term
    ? players.filter(
        (player) =>
          player.name?.toLowerCase().includes(term) ||
          player.email?.toLowerCase().includes(term)
      )
    : players;

  return (
    <div>
      <h1 className={styles.title}>Usuários</h1>

      <div className={styles.toolbar}>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome ou email..."
        />
      </div>

      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage={
          term
            ? 'Nenhum usuário encontrado para a busca.'
            : 'Nenhum usuário cadastrado.'
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
