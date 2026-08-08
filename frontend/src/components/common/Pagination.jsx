import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.wrapper} aria-label="Paginação">
      <button
        className={styles.btn}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={[styles.btn, p === page ? styles.active : ''].join(' ')}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        className={styles.btn}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Próxima página"
      >
        ›
      </button>
    </nav>
  );
}
