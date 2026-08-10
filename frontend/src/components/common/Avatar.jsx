import styles from './Avatar.module.css';

export default function Avatar({ name = '', src, size = 'md' }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  if (src) {
    return <img src={src} alt={name} className={[styles.avatar, styles[size]].join(' ')} />;
  }

  return (
    <div className={[styles.avatar, styles[size], styles.placeholder].join(' ')} aria-label={name}>
      {initials}
    </div>
  );
}
