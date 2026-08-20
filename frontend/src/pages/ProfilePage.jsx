import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateProfileRequest } from '../services/authService';
import Input from '../components/common/Input';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!email.includes('@')) {
      errors.email = 'E-mail inválido';
    }

    if (!phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    }

    return errors;
  }

  function handleCancel() {
    // volta os campos para os dados originais do contexto
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setFieldErrors({ name: '', email: '', phone: '' });
    setError('');
    setEditing(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validate();
    const hasErrors = Object.values(errors).some((msg) => msg);

    if (hasErrors) {
      setFieldErrors({ name: '', email: '', phone: '', ...errors });
      return;
    }

    setFieldErrors({ name: '', email: '', phone: '' });
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updatedPlayer = await updateProfileRequest(user.id, { name, email, phone });
      updateUser(updatedPlayer);
      setSuccess('Dados atualizados com sucesso!');
      setEditing(false);
    } catch (err) {
      const message = err?.response?.data?.error?.message || 'Erro ao atualizar perfil. Tente novamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meu perfil</h1>
      <p className={styles.subtitle}>Veja e edite seus dados pessoais.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Nome"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
          disabled={!editing}
          required
        />

        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          disabled={!editing}
          required
        />

        <Input
          label="Telefone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={fieldErrors.phone}
          disabled={!editing}
          required
        />

        {error && <p role="alert" className={styles.error}>{error}</p>}
        {success && <p role="status" className={styles.success}>{success}</p>}

        {!editing ? (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setEditing(true)}
          >
            Editar dados
          </button>
        ) : (
          <div className={styles.buttonRow}>
            <button type="submit" className={styles.primaryButton} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        )}
      </form>

      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  );
}
