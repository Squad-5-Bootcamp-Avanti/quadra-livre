import styles from './Loading.module.css';

export default function Loading({ fullScreen = false, size = 'md', text = 'Carregando...' }) {
  return (
    <div className={[styles.wrapper, fullScreen ? styles.fullScreen : ''].join(' ')} role="status" aria-label={text}>
      <div className={[styles.spinner, styles[size]].join(' ')} />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
}
