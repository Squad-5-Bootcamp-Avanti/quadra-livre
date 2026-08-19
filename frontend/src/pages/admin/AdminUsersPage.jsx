import { useCallback, useEffect, useState } from 'react';
import {
  getPlayers,
  setPlayerStatus,
  setPlayerRole,
  deletePlayer,
} from '../../services/adminService';
import { useUI } from '../../contexts/UIContext';
import { useAuth } from '../../contexts/AuthContext';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import styles from './AdminUsersPage.module.css';

const PAGE_SIZE = 10;

// Textos do diálogo de confirmação por tipo de ação
const DIALOG_PROPS = {
  status: (player) => ({
    title: player.isActive ? 'Desativar usuário' : 'Ativar usuário',
    message: player.isActive
      ? `Desativar ${player.name}? O usuário não conseguirá mais fazer login até ser reativado.`
      : `Reativar ${player.name}? O usuário voltará a conseguir fazer login.`,
    confirmLabel: player.isActive ? 'Desativar' : 'Ativar',
    danger: player.isActive,
  }),
  role: (player) => ({
    title: player.role === 'ADMIN' ? 'Rebaixar para jogador' : 'Promover a administrador',
    message: player.role === 'ADMIN'
      ? `Remover as permissões de administrador de ${player.name}?`
      : `Conceder permissões de administrador a ${player.name}?`,
    confirmLabel: 'Confirmar',
    danger: false,
  }),
  delete: (player) => ({
    title: 'Excluir usuário',
    message: `Excluir ${player.name}? Todas as reservas deste usuário serão excluídas junto. Esta ação não pode ser desfeita.`,
    confirmLabel: 'Excluir',
    danger: true,
  }),
};

export default function AdminUsersPage() {
  const { addToast } = useUI();
  const { user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Diálogo único de confirmação: null ou { type: 'status' | 'role' | 'delete', player }
  const [dialog, setDialog] = useState(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
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
  }, [page, addToast]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleConfirm() {
    const { type, player } = dialog;
    setActing(true);
    try {
      if (type === 'status') {
        await setPlayerStatus(player.id, !player.isActive);
        addToast(player.isActive ? 'Usuário desativado com sucesso.' : 'Usuário ativado com sucesso.');
      } else if (type === 'role') {
        await setPlayerRole(player.id, player.role === 'ADMIN' ? 'JOGADOR' : 'ADMIN');
        addToast('Perfil do usuário atualizado com sucesso.');
      } else {
        await deletePlayer(player.id);
        addToast('Usuário excluído com sucesso.');
      }
      setDialog(null);
      if (type === 'delete' && players.length === 1 && page > 1) {
        setPage(page - 1); // recua a página; o reload vem pelo useEffect
      } else {
        await load();
      }
    } catch (err) {
      const message = err?.response?.data?.error?.message || 'Não foi possível concluir a ação.';
      addToast(message, 'danger');
    } finally {
      setActing(false);
    }
  }

  // Busca client-side sobre a página carregada, por nome ou email.
  const term = search.trim().toLowerCase();
  const filtered = term
    ? players.filter(
        (player) =>
          player.name?.toLowerCase().includes(term) ||
          player.email?.toLowerCase().includes(term)
      )
    : players;

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
    {
      key: 'isActive',
      label: 'Status',
      render: (isActive) => (
        <Badge variant={isActive ? 'success' : 'danger'}>
          {isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, player) =>
        player.id === user?.id ? (
          <span className={styles.self}>Você</span>
        ) : (
          <span className={styles.actions}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDialog({ type: 'status', player })}
            >
              {player.isActive ? 'Desativar' : 'Ativar'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDialog({ type: 'role', player })}
            >
              {player.role === 'ADMIN' ? 'Rebaixar' : 'Promover'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setDialog({ type: 'delete', player })}
            >
              Excluir
            </Button>
          </span>
        ),
    },
  ];

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

      {dialog && (
        <ConfirmDialog
          open
          onClose={() => setDialog(null)}
          onConfirm={handleConfirm}
          loading={acting}
          {...DIALOG_PROPS[dialog.type](dialog.player)}
        />
      )}
    </div>
  );
}
