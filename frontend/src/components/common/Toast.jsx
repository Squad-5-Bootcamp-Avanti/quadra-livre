import { useUI } from '../../contexts/UIContext';
import styles from './Toast.module.css';

const ICONS = { success: '✓', danger: '✕', warning: '⚠', info: 'i' };

export default function ToastContainer() {
  const { toasts, removeToast } = useUI();

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={[styles.toast, styles[toast.type]].join(' ')} role="alert">
          <span className={styles.icon}>{ICONS[toast.type] || ICONS.info}</span>
          <span className={styles.message}>{toast.message}</span>
          <button className={styles.close} onClick={() => removeToast(toast.id)} aria-label="Fechar">✕</button>
        </div>
      ))}
    </div>
  );
}
