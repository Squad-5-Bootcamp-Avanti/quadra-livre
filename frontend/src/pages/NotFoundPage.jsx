import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Página não encontrada</h1>
      <p className={styles.description}>
        A página que você está procurando não existe ou foi movida.
      </p>
      <Button onClick={() => navigate('/')}>Voltar ao início</Button>
    </div>
  );
}
