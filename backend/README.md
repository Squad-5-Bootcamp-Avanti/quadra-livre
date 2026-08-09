# Quadra Livre — Backend

Projeto em equipe — Sistema de Agendamento de Quadras Esportivas.

> Este é o README específico do **backend**. Para visão geral do projeto (frontend, deploy, fluxo de Git, cronograma da equipe), veja o [README na raiz do repositório](../README.md).

Este repositório contém a API REST do Quadra Livre: estrutura em camadas, conexão com PostgreSQL via Prisma, autenticação JWT/RBAC e os CRUDs de Jogadores, Quadras e Reservas.

---

## ✅ O que já está pronto

- [x] Estrutura de pastas do projeto (arquitetura em camadas: Controller → Service → Repository)
- [x] Prisma conectado ao PostgreSQL, com o `schema.prisma` modelando `Player`, `Court` e `Reservation`
- [x] Migrations aplicadas (tabelas criadas no banco)
- [x] Servidor Express rodando, com:
  - Tratamento global de erros (`errorHandler.middleware.js`), preparado para os erros mais comuns do Prisma (e-mail duplicado, registro não encontrado)
  - Middleware de validação de payload (`validate.middleware.js`, usando `express-validator`)
  - Health-check em `GET /api/health`
  - Classe de erro padronizada (`ApiError`) e helper de resposta padronizada (`httpResponse.js`)
- [x] Script de seed (`prisma/seed.js`) com dados fictícios de exemplo
- [x] **Autenticação JWT + autorização por role (RBAC)**
- [x] **CRUD de Jogadores** (`player.controller.js`, `player.service.js`, `player.repository.js`, `player.routes.js`) — Carol
- [x] **CRUD de Quadras** (`court.controller.js`, `court.service.js`, `court.repository.js`, `court.routes.js`) — Desire
- [x] **CRUD de Reservas + regra de conflito de horário** (`reservation.controller.js`, `reservation.service.js`, `reservation.repository.js`, `reservation.routes.js`) — Lili + Diego
- [x] **Deploy em produção no Render** (branch `main`, deploy automático a cada push)
- [ ] Testes (Postman/Insomnia) + documentação final da API — Pedro Giffoni

## 🚧 Divisão das tarefas entre a equipe

| Responsável | Tarefa |
|---|---|
| Fernanda | Tech Lead / Setup: estrutura do projeto, conexão do Prisma ao PostgreSQL, migrations, servidor Express, autenticação JWT/RBAC e deploy em produção |
| Carol | CRUD de Jogadores |
| Desire | CRUD de Quadras |
| Lili + Diego (dupla) | CRUD de Reservas + regra de conflito de horário |
| Pedro Giffoni | Testes (Postman/Insomnia) + README final do projeto |

---

## 🏗 Arquitetura

```
Requisição HTTP → Controller → Service → Repository → Prisma → PostgreSQL
```

- **Controller**: recebe a requisição, delega ao Service, formata a resposta com `httpResponse.js`.
- **Service**: concentra as regras de negócio.
- **Repository**: isola o acesso ao Prisma/banco de dados.

Cada rota de CRUD segue o padrão já usado no `routes/index.js` (ver comentários no próprio arquivo) — o arquivo `<entidade>.routes.js` fica em `src/routes/`, importado e registrado lá.

Use `asyncHandler` (em `src/utils/asyncHandler.js`) em todo Controller assíncrono, para não precisar repetir `try/catch`:
```js
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  // ...
});
```

Use `ApiError` (em `src/utils/ApiError.js`) para erros de negócio:
```js
const ApiError = require('../utils/ApiError');

throw ApiError.notFound('Jogador não encontrado.');
throw ApiError.conflict('Já existe uma reserva para esta quadra neste horário.', 'RESERVATION_CONFLICT');
```

### Autenticação e autorização

A API usa **JWT** para autenticação. Rotas protegidas exigem o header:

```
Authorization: Bearer <token>
```

O controle de acesso por papel (RBAC) restringe algumas rotas a roles específicas (ex: `ADMIN`). Consulte os middlewares de autenticação/autorização em `src/middlewares/` para o nome exato dos arquivos e como aplicá-los em novas rotas.

---

## 📁 Estrutura de pastas

```
backend/
├── prisma/
│   ├── schema.prisma       # modelos Player, Court, Reservation
│   └── seed.js              # dados fictícios de exemplo
├── src/
│   ├── config/
│   │   └── database.js       # instância única do Prisma Client
│   ├── controllers/          # player, court, reservation
│   ├── services/              # player, court, reservation
│   ├── repositories/           # player, court, reservation
│   ├── routes/
│   │   └── index.js            # agregador de rotas + health-check
│   ├── middlewares/
│   │   ├── errorHandler.middleware.js
│   │   ├── notFound.middleware.js
│   │   ├── validate.middleware.js
│   │   └── (autenticação/autorização JWT/RBAC)
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── asyncHandler.js
│   │   └── httpResponse.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL instalado e rodando (ou uma connection string do Neon)

### Passos

```bash
git clone <url-deste-repositorio>
cd backend
cp .env.example .env
```

Edite o `.env` com sua conexão real:
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/quadra_livre?schema=public"
JWT_SECRET="uma-chave-secreta-qualquer-para-desenvolvimento"
PORT=3333
NODE_ENV=development
```

Crie o banco (se ainda não existir):
```sql
CREATE DATABASE quadra_livre;
```

Instale as dependências e rode a migration:
```bash
npm install
npx prisma migrate dev --name init
```

(Opcional) Popule com dados de exemplo:
```bash
npx prisma db seed
```

Suba o servidor:
```bash
npm run dev
```

Teste em `http://localhost:3333/api/health`.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia com hot-reload (nodemon) |
| `npm start` | Inicia em modo produção |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Roda migrations em desenvolvimento |
| `npm run prisma:studio` | Abre o Prisma Studio (interface visual do banco) |
| `npm run prisma:seed` | Popula o banco com dados de exemplo |

---

## ☁️ Deploy em produção

A API roda em produção no **Render**, com deploy automático a cada push na branch `main` (diretório raiz do serviço: `backend/`).

- URL: https://quadra-livre-api.onrender.com
- Health-check: https://quadra-livre-api.onrender.com/api/health
- Variáveis de ambiente de produção (`DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV`) são configuradas direto no painel do Render — nunca commitar valores reais no `.env`.

> O plano usado no Render é o free tier: o serviço "dorme" após um tempo sem receber requisições e leva ~30–50s pra acordar na primeira chamada seguinte. Isso é esperado.

Mais detalhes sobre o deploy completo (frontend + backend + banco) estão no [README da raiz](../README.md).

---

## 📌 Convenções do time

- Nomes de arquivos e variáveis em **inglês**, seguindo o padrão já usado no schema (`Player`, `Court`, `Reservation`).
- Cada entidade segue o padrão de 4 arquivos: `*.controller.js`, `*.service.js`, `*.repository.js`, `*.routes.js`.
- Toda rota que recebe dados do usuário (`POST`/`PUT`) deve ter validação com `express-validator` + o middleware `validate.middleware.js`, seguindo o padrão de exemplo nos comentários do `routes/index.js`.
- Rotas protegidas usam o middleware de autenticação JWT; rotas restritas a admin usam o middleware de RBAC.
- Commits no padrão `feat: `, `fix: `, `docs: `, `chore: ` (Conventional Commits).
- Branches de feature partem de `develop`, PR para `develop` — veja o fluxo completo no [README da raiz](../README.md#5-fluxo-de-git--branches-e-pull-requests).
