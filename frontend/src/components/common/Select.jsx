import styles from './Select.module.css';

export default function Select({
  label,
  error,
  hint,
  id,
  required,
  options = [],
  placeholder,
  ...props
}) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={styles.control}>
        <select
          id={selectId}
          className={[styles.select, error ? styles.hasError : ''].join(' ')}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      {hint && !error && <span id={`${selectId}-hint`} className={styles.hint}>{hint}</span>}
      {error && <span id={`${selectId}-error`} className={styles.error} role="alert">{error}</span>}
    </div>
  );
}
