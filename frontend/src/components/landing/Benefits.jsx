import useScrollReveal from "../../hooks/useScrollReveal";
import styles from "./Benefits.module.css";

const items = [
  {
    title: "Reserva rápida",
    text: "Agende em poucos segundos, sem burocracia e sem ligação.",
  },
  {
    title: "Sem conflitos",
    text: "Validação automática de horários — nunca duas reservas na mesma quadra.",
  },
  {
    title: "Acesso fácil",
    text: "Reserve pelo celular, tablet ou computador, de onde estiver.",
  },
];

export default function Benefits() {
  const [ref, visible] = useScrollReveal();

  return (
    <section className={styles.benefits} aria-label="Benefícios">
      <div className={styles.container}>
        <h2 className={styles.title}>Por que usar o Quadra Livre</h2>

        <div ref={ref} className={styles.grid}>
          {items.map((item, index) => (
            <div
              key={item.title}
              className={`${styles.card} ${visible ? styles.cardVisible : ""}`}
              style={{ transitionDelay: `${index * 120}ms` }}
              tabIndex={0}
              role="group"
              aria-label={`${item.title}: ${item.text}`}
            >
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
