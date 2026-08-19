import { useState } from "react";
import useScrollReveal from "../../hooks/useScrollReveal";
import styles from "./FAQ.module.css";

const faqData = [
  {
    pergunta: "Como faço para reservar uma quadra?",
    resposta:
      "Basta criar uma conta, escolher a quadra desejada, selecionar a data e o horário disponíveis e confirmar a reserva. Você receberá uma confirmação por e-mail.",
  },
  {
    pergunta: "Posso cancelar ou remarcar uma reserva?",
    resposta:
      'Sim. Você pode cancelar ou remarcar sua reserva através da área "Minhas Reservas" até 24 horas antes do horário marcado, sem custo adicional.',
  },
  {
    pergunta: "Quais formas de pagamento são aceitas?",
    resposta:
      "Aceitamos cartão de crédito, débito e Pix. O pagamento é processado no momento da confirmação da reserva.",
  },
  {
    pergunta: "Preciso pagar para me cadastrar?",
    resposta:
      "Não. O cadastro na plataforma é totalmente gratuito. Você só paga pelas reservas que realizar.",
  },
  {
    pergunta: "Como entro em contato em caso de problemas?",
    resposta:
      "Você pode usar o formulário na seção de contato desta página ou enviar um e-mail para nosso suporte, que responde em até 24 horas úteis.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, visible] = useScrollReveal();

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className={styles.faq} id="faq" aria-label="Perguntas frequentes">
      <div className={styles.container}>
        <h2 className={styles.title}>Perguntas frequentes</h2>
        <p className={styles.subtitle}>
          Tudo o que você precisa saber antes de começar a usar a plataforma.
        </p>

        <div ref={ref} className={styles.list}>
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            const questionId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;

            return (
              <div
                key={index}
                className={`${styles.item} ${isOpen ? styles.itemOpen : ""} ${
                  visible ? styles.itemVisible : ""
                }`}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <h3 className={styles.questionHeading}>
                  <button
                    id={questionId}
                    className={styles.question}
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span>{item.pergunta}</span>
                    <span className={styles.icon} aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  className={styles.answer}
                  hidden={!isOpen}
                >
                  <p>{item.resposta}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
