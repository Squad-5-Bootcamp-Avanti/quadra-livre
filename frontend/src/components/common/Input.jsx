import styles from './Input.module.css';

export default function Input({
  label,
  error,
  hint,
  id,
  required,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        className={[styles.input, error ? styles.hasError : ''].join(' ')}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error && <span id={`${inputId}-hint`} className={styles.hint}>{hint}</span>}
      {error && <span id={`${inputId}-error`} className={styles.error} role="alert">{error}</span>}
    </div>
  );
}
