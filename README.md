# Quadra Livre — Squad 05 (Bootcamp Atlântico Avanti)

Sistema de agendamento de quadras esportivas. Monorepo com backend (API REST) e frontend (SPA), desenvolvido em equipe como desafio do Bootcamp Atlântico Avanti.

Este README existe pra qualquer pessoa do time entender, sem precisar perguntar a mais ninguém: **o que já está pronto, como o projeto está estruturado, como rodar tudo localmente, como funciona o deploy em produção e qual o fluxo de Git que devemos seguir daqui pra frente.**

---

## Índice

1. [Visão geral e arquitetura](#1-visão-geral-e-arquitetura)
2. [Ambientes em produção](#2-ambientes-em-produção)
3. [Como rodar o projeto localmente](#3-como-rodar-o-projeto-localmente)
4. [Variáveis de ambiente](#4-variáveis-de-ambiente)
5. [Fluxo de Git — branches e Pull Requests](#5-fluxo-de-git--branches-e-pull-requests)
6. [Cronograma e responsáveis](#6-cronograma-e-responsáveis)
7. [O que já está pronto (status atual)](#7-o-que-já-está-pronto-status-atual)
8. [Problemas conhecidos / troubleshooting](#8-problemas-conhecidos--troubleshooting)
9. [Links úteis](#9-links-úteis)

---

## 1. Visão geral e arquitetura

O repositório é um **monorepo** com duas pastas principais na raiz:

```
quadra-livre/
├── backend/     → API REST (Node.js + Express + Prisma + PostgreSQL)
└── frontend/    → SPA (React + Vite + React Router)
```

Cada pasta tem seu próprio `package.json`, `node_modules` e ciclo de deploy — são dois projetos independentes que conversam via HTTP (o frontend chama a API do backend).

**Stack:**

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + React Router 6 + Axios |
| Backend | Node.js + Express + Prisma ORM |
| Banco de dados | PostgreSQL (hospedado no [Neon](https://neon.tech)) |
| Autenticação | JWT + RBAC (roles) |
| Deploy frontend | [Vercel](https://vercel.com) |
| Deploy backend | [Render](https://render.com) |

**Arquitetura do backend** (Controller → Service → Repository):

```
Requisição HTTP → Controller → Service → Repository → Prisma → PostgreSQL
```

- **Controller**: recebe a requisição, delega ao Service, formata a resposta com `httpResponse.js`.
- **Service**: concentra as regras de negócio.
- **Repository**: isola o acesso ao Prisma/banco de dados.

**Arquitetura do frontend:**

```
frontend/src/
├── components/
│   ├── common/     → componentes base (Button, Input, Modal, Card, Badge, Avatar, Loading, Toast, Table, SearchBar, Pagination)
│   └── layout/     → Navbar, Sidebar, Footer
├── layouts/        → MainLayout, AuthLayout, AdminLayout
├── contexts/        → AuthContext, UIContext
├── routes/          → AppRoutes, ProtectedRoute
├── services/        → api.js (instância do axios) e services por módulo
├── pages/            → páginas de cada módulo (Autenticação, Quadras, Reservas, Admin, Landing Page)
└── styles/
```

---

## 2. Ambientes em produção

| | URL | Onde gerenciar |
|---|---|---|
| **Frontend (produção)** | https://quadra-livre-tfv6.vercel.app | [Vercel Dashboard](https://vercel.com/projeto-avanti/quadra-livre-tfv6) — time "Projeto Avanti" |
| **Backend / API** | https://quadra-livre-api.onrender.com | [Render Dashboard](https://dashboard.render.com/web/srv-d9rog12jnfac73856n20) |
| **Health-check da API** | https://quadra-livre-api.onrender.com/api/health | — |
| **Banco de dados** | PostgreSQL (Neon) | Painel do [Neon](https://neon.tech) |

**Como o deploy funciona:**

- **Vercel** está conectado ao repositório (organização `Squad-5-Bootcamp-Avanti`) e faz deploy automático a cada push na branch **`main`**, usando `frontend/` como diretório raiz do projeto.
- **Render** também está conectado ao repositório e faz deploy automático a cada push na branch **`main`**, usando `backend/` como diretório raiz do serviço.
- O frontend sabe onde está a API através da variável `VITE_API_URL`, configurada nas Environment Variables do projeto na Vercel (aponta para a URL da API no Render).
- **Atenção:** o Render está no plano free — a API "dorme" depois de um tempo sem uso e demora ~30–50s pra acordar na primeira requisição depois disso. Isso é esperado, não é bug.

---

## 3. Como rodar o projeto localmente

Pré-requisitos: Node.js 18+, PostgreSQL (ou usar a connection string do Neon direto).

### Backend

```bash
cd backend
cp .env.example .env
# edite o .env com sua DATABASE_URL, JWT_SECRET etc. (veja seção 4)
npm install
npx prisma migrate dev --name init
npx prisma db seed        # opcional — popula com dados fictícios
npm run dev                # roda em http://localhost:3333
```

Teste em: `http://localhost:3333/api/health`

Scripts disponíveis: `npm run dev` (hot-reload), `npm start` (produção), `npm run prisma:generate`, `npm run prisma:migrate`, `npm run prisma:studio`, `npm run prisma:seed`.

### Frontend

```bash
cd frontend
cp .env.example .env
# edite o .env com VITE_API_URL=http://localhost:3333/api (pra usar o backend local)
npm install
npm run dev                # roda em http://localhost:5173 (padrão do Vite)
```

Scripts disponíveis: `npm run dev`, `npm run build`, `npm run preview`.

---

## 4. Variáveis de ambiente

**Nunca commitar `.env` com valores reais.** Cada pasta tem um `.env.example` mostrando quais chaves são esperadas.

### Backend (`backend/.env`)

| Variável | Para que serve |
|---|---|
| `DATABASE_URL` | Connection string do PostgreSQL (Neon) |
| `JWT_SECRET` | Chave usada pra assinar/validar os tokens JWT |
| `PORT` | Porta do servidor Express (padrão 3333 local; Render define automaticamente em produção) |
| `NODE_ENV` | `development` (ativa logs do morgan) ou `production` |

Em produção, essas variáveis estão configuradas diretamente no **Render** (Environment → quadra-livre-api).

### Frontend (`frontend/.env`)

| Variável | Para que serve |
|---|---|
| `VITE_API_URL` | URL base da API que o frontend vai consumir (ex: `http://localhost:3333/api` local, ou a URL do Render em produção) |

Em produção, essa variável está configurada diretamente na **Vercel** (Settings → Environment Variables do projeto `quadra-livre-tfv6`).

---

## 5. Fluxo de Git — branches e Pull Requests

O repositório tem duas branches principais:

- **`main`** → código estável, é o que está em produção (Vercel e Render fazem deploy automático dela). Só recebe merge de `develop` quando um conjunto de features está pronto e testado.
- **`develop`** → branch de integração do time. É a base para todas as branches de feature a partir de agora.

**Fluxo esperado pra qualquer tarefa nova:**

1. Atualize sua cópia local: `git checkout develop && git pull origin develop`
2. Crie sua branch de feature a partir de `develop`: `git checkout -b feat/nome-da-sua-tarefa`
3. Faça commits pequenos e descritivos, seguindo [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:` etc.)
4. Abra um Pull Request da sua branch **para `develop`** (não para `main`)
5. Peça revisão de pelo menos um colega antes de mergear
6. `main` só recebe merge de `develop` na Sprint 4 (QA + Deploy), ou quando o Tech Lead decidir fazer um release intermediário

> **Nota histórica:** a branch `develop` foi criada em 09/08 a partir da `main` (que já continha a reorganização em `backend/`/`frontend/` e o setup da Sprint 1). Quem já tinha uma branch criada **antes** dessa data, baseada na estrutura antiga (sem as pastas `backend/`/`frontend/`), vai ter conflitos ao mergear — nesse caso, recrie a branch a partir da `develop` atual em vez de tentar resolver o conflito manualmente.

---

## 6. Cronograma e responsáveis

Cronograma completo: [ver documento no Google Docs](https://docs.google.com/document/d/1smNC16qHS8c4Kn1dOE0P7de259jIaACxonzMkUrYvNE/edit) — 6 integrantes, 4 sprints, 06 a 22 de agosto de 2026.

| Sprint | Período | Foco |
|---|---|---|
| Sprint 1 — Fundação | 06–08 ago | Setup do projeto, componentes base, layouts, rotas, contexts (responsabilidade do Tech Lead) |
| Sprint 2 — Features Paralelas | 08–13 ago | Cada integrante constrói seu módulo |
| Sprint 3 — Integração e Refinamento | 14–19 ago | Telas de detalhe, correção de bugs, ajustes de responsividade |
| Sprint 4 — QA, Deploy e Apresentação | 20–22 ago | Code review final, testes de integração, deploy em produção, entrega |

**Divisão por módulo (frontend, conforme o cronograma):**

| Integrante | Módulo | Entrega Sprint 2 |
|---|---|---|
| Int. 1 | Setup / Tech Lead (só Sprint 1) | — |
| Int. 2 | Autenticação | Telas de Login/Cadastro, AuthContext, `authService.js` |
| Int. 3 | Quadras | Listagem de quadras, `courtService.js` |
| Int. 4 | Reservas | Calendário, criação de reserva, `reservationService.js` |
| Int. 5 | Admin | Dashboard, `adminService.js` |
| Int. 6 | Landing Page | Seções Hero, Benefícios, Como Funciona |

> ⚠️ **Pendente:** confirmar o nome + usuário do GitHub de cada Int. 2 a Int. 6 e atualizar esta tabela (ex: `@usuario-github`). No histórico de commits aparecem `CarolRodrigues14`, `demartins-dev`, `Eliana100`, `diegommcosta` e `PedroGiffoni` associados a módulos do backend (Jogadores, Quadras, Reservas, Testes/Docs) — provavelmente as mesmas pessoas do frontend, mas vale confirmar com o time antes de bater o martelo.

---

## 7. O que já está pronto (status atual)

- [x] Estrutura do backend (Express + Prisma + PostgreSQL) — Sprint 1
- [x] Estrutura do frontend (Vite + React Router + componentes base + layouts + contexts) — Sprint 1
- [x] CRUD de Jogadores, Quadras e Reservas no backend (com validação de conflito de horário)
- [x] Autenticação JWT/RBAC no backend
- [x] Deploy do frontend na Vercel (produção, branch `main`, diretório `frontend/`)
- [x] Deploy do backend no Render (produção, branch `main`, diretório `backend/`)
- [x] Banco de dados PostgreSQL provisionado no Neon
- [x] Frontend e backend conectados via `VITE_API_URL` (testado e confirmado em produção)
- [x] Branch `develop` criada para o fluxo de integração do time
- [ ] Telas de cada módulo (Autenticação, Quadras, Reservas, Admin, Landing Page) — em andamento, Sprint 2/3
- [ ] Testes de integração frontend ↔ backend em staging — Sprint 4
- [ ] Apresentação final — 22/08

---

## 8. Problemas conhecidos / troubleshooting

**"Repositório não encontrado" ao importar na Vercel:** a Vercel estava procurando o repositório na conta pessoal do GitHub (namespace errado) em vez da organização `Squad-5-Bootcamp-Avanti`. Solução: no import (`vercel.com/new`), trocar o seletor de namespace do GitHub para a organização antes de importar.

**API "não responde" na primeira chamada:** normal — o Render (plano free) coloca o serviço pra dormir após inatividade. A primeira requisição demora até ~50s pra acordar o serviço. Não é erro.

**Conflitos de merge ao trazer uma branch antiga pra `develop`/`main`:** provavelmente sua branch foi criada antes da reorganização em `backend/`/`frontend/` (08/08). Recrie a branch a partir da `develop` atual.

---

## 9. Links úteis

- Cronograma completo: [Google Docs](https://docs.google.com/document/d/1smNC16qHS8c4Kn1dOE0P7de259jIaACxonzMkUrYvNE/edit)
- Frontend em produção: https://quadra-livre-tfv6.vercel.app
- API em produção: https://quadra-livre-api.onrender.com
- Painel Vercel: https://vercel.com/projeto-avanti/quadra-livre-tfv6
- Painel Render: https://dashboard.render.com/web/srv-d9rog12jnfac73856n20

---

*Squad 05 · Bootcamp Atlântico Avanti · Projeto Quadra Livre*
