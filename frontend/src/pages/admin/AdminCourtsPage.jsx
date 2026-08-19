import { useCallback, useEffect, useState } from 'react';
import { getCourts, createCourt, updateCourt, deleteCourt } from '../../services/adminService';
import { useUI } from '../../contexts/UIContext';
import { SPORT_LABELS, SPORT_OPTIONS } from '../../constants/sports';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import styles from './AdminCourtsPage.module.css';

const PAGE_SIZE = 10;

const EMPTY_FORM = { name: '', sport: '', location: '' };

export default function AdminCourtsPage() {
  const { addToast } = useUI();
  const [courts, setCourts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal único de criar/editar: null (fechado) ou { court } (court null = criação)
  const [formModal, setFormModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [removing, setRemoving] = useState(false);

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

  function openCreate() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setFormModal({ court: null });
  }

  function openEdit(court) {
    setForm({ name: court.name, sport: court.sport, location: court.location });
    setFormErrors({});
    setFormModal({ court });
  }

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // O backend exige os três campos (inclusive na edição)
    const errors = {};
    if (!form.name.trim()) errors.name = 'O nome é obrigatório.';
    if (!form.sport) errors.sport = 'Selecione o esporte.';
    if (!form.location.trim()) errors.location = 'A localização é obrigatória.';
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (formModal.court) {
        await updateCourt(formModal.court.id, form);
        addToast('Quadra atualizada com sucesso.');
      } else {
        await createCourt(form);
        addToast('Quadra criada com sucesso.');
      }
      setFormModal(null);
      await load();
    } catch (err) {
      const code = err?.response?.data?.error?.code;
      if (code === 'COURT_NAME_ALREADY_EXISTS') {
        setFormErrors({ name: 'Já existe uma quadra com este nome.' });
      } else {
        const message = err?.response?.data?.error?.message || 'Não foi possível salvar a quadra.';
        addToast(message, 'danger');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setRemoving(true);
    try {
      await deleteCourt(deleting.id);
      addToast('Quadra excluída com sucesso.');
      setDeleting(null);
      if (paginated.length === 1 && page > 1) {
        setPage(page - 1);
      }
      await load();
    } catch (err) {
      const message = err?.response?.data?.error?.message || 'Não foi possível excluir a quadra.';
      addToast(message, 'danger');
    } finally {
      setRemoving(false);
    }
  }

  const columns = [
    { key: 'name', label: 'Nome' },
    {
      key: 'sport',
      label: 'Esporte',
      render: (sport) => <Badge>{SPORT_LABELS[sport] || sport}</Badge>,
    },
    { key: 'location', label: 'Localização' },
    {
      key: 'actions',
      label: 'Ações',
      render: (_, court) => (
        <span className={styles.actions}>
          <Button variant="ghost" size="sm" onClick={() => openEdit(court)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleting(court)}>
            Excluir
          </Button>
        </span>
      ),
    },
  ];

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
        <Button onClick={openCreate}>Nova quadra</Button>
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

      <Modal
        open={!!formModal}
        onClose={saving ? () => {} : () => setFormModal(null)}
        title={formModal?.court ? 'Editar quadra' : 'Nova quadra'}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormModal(null)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" form="court-form" loading={saving}>
              Salvar
            </Button>
          </>
        }
      >
        <form id="court-form" className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Nome"
            required
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            error={formErrors.name}
            placeholder="Ex.: Quadra Central"
          />
          <Select
            label="Esporte"
            required
            value={form.sport}
            onChange={(e) => setField('sport', e.target.value)}
            options={SPORT_OPTIONS}
            placeholder="Selecione o esporte"
            error={formErrors.sport}
          />
          <Input
            label="Localização"
            required
            value={form.location}
            onChange={(e) => setField('location', e.target.value)}
            error={formErrors.location}
            placeholder="Ex.: Bloco B, térreo"
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Excluir quadra"
        message={`Excluir a quadra "${deleting?.name}"? Todas as reservas desta quadra serão excluídas junto. Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={removing}
        danger
      />
    </div>
  );
}
