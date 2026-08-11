import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/common/Input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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

    if (!password) {
      errors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validate();
    const hasErrors = Object.values(errors).some((msg) => msg);

    if (hasErrors) {
      setFieldErrors({ name: '', email: '', phone: '', password: '', ...errors });
      return;
    }

    setFieldErrors({ name: '', email: '', phone: '', password: '' });
    setError('');
    setLoading(true);

    try {
      await register({ name, email, phone, password });
      navigate('/quadras');
    } catch (err) {
      const message = err?.response?.data?.error?.message || 'Erro ao criar conta. Tente novamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nome"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={fieldErrors.name}
        required
      />

      <Input
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        required
      />

      <Input
        label="Telefone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={fieldErrors.phone}
        required
      />

      <Input
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        required
      />

      {error && <p role="alert" className="form-error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Criando conta...' : 'Cadastrar'}
      </button>

      <Link to="/login">Já tem conta? Entrar</Link>
    </form>
  );
}