import Modal from './Modal';
import Button from './Button';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  loading = false,
  danger = false,
}) {
  // Enquanto a ação está em andamento, ESC/overlay não fecham o diálogo.
  const handleClose = loading ? () => {} : onClose;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className={styles.message}>{message}</p>
    </Modal>
  );
}
