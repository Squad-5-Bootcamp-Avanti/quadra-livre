import styles from './Card.module.css';

export default function Card({ children, className = '', padding = 'md', ...props }) {
  return (
    <div className={[styles.card, styles[padding], className].join(' ')} {...props}>
      {children}
    </div>
  );
}
