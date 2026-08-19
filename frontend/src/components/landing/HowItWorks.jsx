import useScrollReveal from "../../hooks/useScrollReveal";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    text: "Cadastro rápido com e-mail ou telefone, leva menos de um minuto.",
  },
  {
    number: "02",
    title: "Escolha a quadra",
    text: "Filtre por esporte, localização e horário disponível.",
  },
  {
    number: "03",
    title: "Confirme a reserva",
    text: "Pague online e receba a confirmação na hora, sem espera.",
  },
];

export default function HowItWorks() {
  const [ref, visible] = useScrollReveal();

  return (
    <section className={styles.howItWorks} aria-label="Como funciona">
      <div className={styles.container}>
        <h2 className={styles.title}>Como funciona</h2>

        <div ref={ref} className={styles.steps}>
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`${styles.step} ${visible ? styles.stepVisible : ""}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <span className={styles.number}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
              {index < steps.length - 1 && (
                <span className={styles.connector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
