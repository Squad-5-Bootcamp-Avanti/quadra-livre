# Quadra Livre — Backend (Setup Inicial)

Projeto em equipe — Sistema de Agendamento de Quadras Esportivas.

Este repositório contém a **fundação do backend**, já pronta para o time começar a codar em paralelo: estrutura de pastas, conexão com PostgreSQL via Prisma, migration inicial aplicada, e o servidor Express básico no ar.



---

## ✅ O que já está pronto

- [x] Estrutura de pastas do projeto (arquitetura em camadas: Controller → Service → Repository)
- [x] Prisma conectado ao PostgreSQL, com o `schema.prisma` modelando `Player`, `Court` e `Reservation`
- [x] Migration inicial aplicada (tabelas criadas no banco)
- [x] Servidor Express básico rodando, com:
  - Tratamento global de erros (`errorHandler.middleware.js`), já preparado para os erros mais comuns do Prisma (e-mail duplicado, registro não encontrado)
  - Middleware de validação de payload (`validate.middleware.js`, usando `express-validator`)
  - Health-check em `GET /api/health`
  - Classe de erro padronizada (`ApiError`) e helper de resposta padronizada (`httpResponse.js`)
- [x] Script de seed (`prisma/seed.js`) com dados fictícios de exemplo

## 🚧 Divisão das tarefas entre o time

| Responsável | Tarefa |
|---|---|
| Fernanda | Tech Lead / Setup: estrutura do projeto, conexão do Prisma ao PostgreSQL, migration inicial e servidor Express básico (`schema.prisma`, `database.js`, `server.js`, `errorHandler.middleware.js`, `validate.middleware.js`, `ApiError.js`, `asyncHandler.js`, `httpResponse.js`) ||
| Carol | CRUD de Jogadores (`player.controller.js`, `player.service.js`, `player.repository.js`, `player.routes.js`) |
| Desire | CRUD de Quadras (`court.controller.js`, `court.service.js`, `court.repository.js`, `court.routes.js`) |
| Lili + Colega 5 (dupla) | CRUD de Reservas + regra de conflito de horário (`reservation.controller.js`, `reservation.service.js`, `reservation.repository.js`, `reservation.routes.js`) |
| Colega 6 | Testes (Postman/Insomnia) + README final do projeto |

---

## 🏗 Arquitetura

```
Requisição HTTP → Controller → Service → Repository → Prisma → PostgreSQL
```

- **Controller**: recebe a requisição, delega ao Service, formata a resposta com `httpResponse.js`.
- **Service**: concentra as regras de negócio.
- **Repository**: isola o acesso ao Prisma/banco de dados.

Cada rota de CRUD deve seguir o padrão já usado no `routes/index.js` (ver comentários no próprio arquivo) — crie seu arquivo `<entidade>.routes.js` em `src/routes/`, importe e registre lá.

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
│   ├── controllers/          # (vazio — cada CRUD adiciona o seu aqui)
│   ├── services/              # (vazio — cada CRUD adiciona o seu aqui)
│   ├── repositories/           # (vazio — cada CRUD adiciona o seu aqui)
│   ├── routes/
│   │   └── index.js            # agregador de rotas + health-check
│   ├── middlewares/
│   │   ├── errorHandler.middleware.js
│   │   ├── notFound.middleware.js
│   │   └── validate.middleware.js
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
- PostgreSQL instalado e rodando

### Passos

```bash
git clone <url-deste-repositorio>
cd backend
cp .env.example .env
```

Edite o `.env` com sua conexão real:
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/quadra_livre?schema=public"
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

## 📌 Convenções do time

- Nomes de arquivos e variáveis em **inglês**, seguindo o padrão já usado no schema (`Player`, `Court`, `Reservation`).
- Cada entidade segue o padrão de 4 arquivos: `*.controller.js`, `*.service.js`, `*.repository.js`, `*.routes.js`.
- Toda rota que recebe dados do usuário (`POST`/`PUT`) deve ter validação com `express-validator` + o middleware `validate.middleware.js`, seguindo o padrão de exemplo nos comentários do `routes/index.js`.
- Commits no padrão `feat: `, `fix: `, `docs: `, `chore: ` (Conventional Commits).
