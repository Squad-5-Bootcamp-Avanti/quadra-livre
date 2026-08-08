import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, placeholder = 'Buscar...', onClear }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">🔍</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        aria-label={placeholder}
      />
      {value && (
        <button className={styles.clear} onClick={onClear || (() => onChange(''))} aria-label="Limpar busca">✕</button>
      )}
    </div>
  );
}
