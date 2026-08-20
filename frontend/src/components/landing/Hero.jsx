import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

export default function Hero() {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={styles.hero} aria-label="Apresentação Quadra Livre">
      <svg
        className={`${styles.court} ${drawn ? styles.courtDrawn : ""}`}
        viewBox="0 0 600 340"
        aria-hidden="true"
      >
        <rect
          x="10"
          y="10"
          width="580"
          height="320"
          rx="12"
          className={styles.line}
        />
        <line x1="300" y1="10" x2="300" y2="330" className={styles.line} />
        <circle cx="300" cy="170" r="55" className={styles.line} />
        <rect x="10" y="110" width="90" height="120" className={styles.line} />
        <rect x="500" y="110" width="90" height="120" className={styles.line} />
      </svg>

      <div className={styles.content}>
        <span className={styles.badge}>⏱ Reserva em 30 segundos</span>

        <h1 className={styles.title}>
          Reserve quadras
          <br />
          esportivas <span className={styles.highlight}>online</span>
        </h1>

        <p className={styles.subtitle}>
          Encontre horários disponíveis e faça sua reserva em poucos segundos,
          em quadras de futsal, tênis, vôlei e beach tennis perto de você.
        </p>

        <div className={styles.actions}>
          <Link to="/quadras" className={styles.ctaPrimary}>
            Reservar agora
          </Link>
          <Link to="/cadastro" className={styles.ctaSecondary}>
            Criar conta grátis
          </Link>
        </div>
      </div>
    </section>
  );
}
