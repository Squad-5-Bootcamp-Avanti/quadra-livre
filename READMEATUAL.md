# 🏟️ Sistema de Agendamento de Quadras Esportivas

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## 📖 Sobre o Projeto

O **Sistema de Agendamento de Quadras Esportivas** é uma API RESTful
desenvolvida como entregável do projeto **DFS-2026.2 --- Atlântico /
Avanti**.

Seu objetivo é gerenciar jogadores, quadras esportivas e reservas,
impedindo conflitos de horários e garantindo a organização dos
agendamentos.

---

## 📌 Sumário

- Sobre o Projeto
- Funcionalidades
- Tecnologias
- Arquitetura
- Modelo de Dados
- Regras de Negócio
- Endpoints
- Instalação
- Variáveis de Ambiente
- Testes
- Equipe
- Status

---

## ✨ Funcionalidades

- CRUD de jogadores
- CRUD de quadras
- CRUD de reservas
- Validação automática de conflitos de horário
- Persistência em PostgreSQL
- Prisma ORM

---

## 🛠️ Tecnologias

Tecnologia Finalidade

---

Node.js Runtime JavaScript
Express API REST
Prisma ORM ORM
PostgreSQL Banco de Dados

---

## 📂 Estrutura do Projeto

```text
.
├── prisma
├── src
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── middlewares
│   └── server.js
├── docs
├── package.json
└── README.md
```

---

## 🗄️ Modelo de Dados

### Players

- id
- name
- email
- phone

### Courts

- id
- name
- sport
- location

### Reservations

- id
- playerId
- courtId
- date
- startTime
- endTime

---

## ⚖️ Regra de Negócio

Antes de criar uma reserva, o sistema verifica se já existe outra
reserva para a mesma quadra no mesmo período.

Uma reserva é rejeitada quando:

```text
Início da nova reserva < Fim da reserva existente
E
Fim da nova reserva > Início da reserva existente
```

---

## 📡 Endpoints

### Players

Método Endpoint

---

GET /players
POST /players
PUT /players/:id
DELETE /players/:id

### Courts

Método Endpoint

---

GET /courts
POST /courts
PUT /courts/:id
DELETE /courts/:id

### Reservations

Método Endpoint

---

GET /reservations
POST /reservations
PUT /reservations/:id
DELETE /reservations/:id

---

## 🚀 Instalação

```bash
git clone https://github.com/Squad-5-Bootcamp-Avanti/quadra-livre.git
cd quadra-livre
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

---

## ⚙️ Variáveis de Ambiente

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/quadras_esportivas?schema=public"
PORT=3333
```

---

## 🧪 Testes

Os testes da API podem ser realizados utilizando Postman ou Insomnia.

Casos recomendados:

- CRUD completo de jogadores.
- CRUD completo de quadras.
- CRUD completo de reservas.
- Tentativa de criar reservas com conflito.
- Exclusão de registros.
- Validação de erros.

---

## 👥 Equipe

Integrante Responsabilidade

---

Fernanda Tech Lead
Carol CRUD Players
Desire CRUD Courts
Lili e Diego CRUD Reservations
Pedro Giffoni Testes e documentação

---

## 📌 Status

🚧 Projeto em desenvolvimento.

---

## 📄 Licença

Projeto acadêmico desenvolvido para o programa **DFS-2026.2 ---
Atlântico / Avanti**.
