import { useState } from "react";
import styles from "./Contact.module.css";

export default function Contact() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrar com backend/API de contato quando disponível
    console.log("Dados do formulário de contato:", form);
    setEnviado(true);
    setForm({ nome: "", email: "", mensagem: "" });
  };

  return (
    <section className={styles.contact} id="contato">
      <div className={styles.container}>
        <h2 className={styles.title}>Fale conosco</h2>
        <p className={styles.subtitle}>
          Tem alguma dúvida ou sugestão? Envie uma mensagem para nossa equipe.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mensagem">Mensagem</label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows={5}
              value={form.mensagem}
              onChange={handleChange}
              placeholder="Escreva sua mensagem..."
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Enviar mensagem
          </button>

          {enviado && (
            <p className={styles.success}>
              Mensagem enviada com sucesso! Em breve entraremos em contato.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
