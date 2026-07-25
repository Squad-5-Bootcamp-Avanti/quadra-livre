# 🧪 Plano de Testes - API Quadra Livre

## 1. Objetivo

Este documento descreve todos os testes realizados na API REST do sistema **Quadra Livre**, desenvolvida para gerenciamento de quadras esportivas, jogadores e reservas.

O objetivo destes testes é garantir que todos os endpoints estejam funcionando corretamente, respeitando as regras de negócio implementadas e retornando respostas consistentes para operações de sucesso e erro.

---

# 2. Tecnologias Utilizadas

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Postman
- Express Validator

---

# 3. Ambiente de Testes

Servidor local

```
http://localhost:3333
```

Base URL

```
http://localhost:3333/api
```

Ferramenta utilizada

- Postman Desktop

---

# 4. Estrutura da API

A API está organizada em três módulos principais:

- Players
- Courts
- Reservations

Além disso existe um endpoint de Health Check responsável por verificar se a API está online.

---

# 5. Casos de Teste

---

# HEALTH CHECK

Endpoint

```
GET /api/health
```

Objetivo

Verificar se a API está disponível.

Resultado esperado

- Status HTTP 200
- success = true
- timestamp válido

Resultado obtido

✅ Sucesso

---

# PLAYERS

## Criar Jogador

Endpoint

```
POST /api/players
```

JSON

```json
{
  "name": "Pedro Giffoni",
  "email": "pedro@email.com",
  "phone": "(85)99999-9999"
}
```

Resultado esperado

- HTTP 201
- Jogador criado
- Retorno contendo ID

Resultado

✅ Sucesso

---

## Criar jogador sem nome

JSON

```json
{
  "email": "pedro@email.com",
  "phone": "85999999999"
}
```

Resultado esperado

HTTP 400

Resultado

✅ Sucesso

---

## Criar jogador com email inválido

JSON

```json
{
  "name": "Pedro",
  "email": "abc",
  "phone": "85999999999"
}
```

Resultado esperado

HTTP 400

Resultado

✅ Sucesso

---

## Criar jogador com email duplicado

Objetivo

Verificar a regra de negócio que impede dois jogadores com o mesmo email.

Resultado esperado

HTTP 409

Resultado

✅ Sucesso

---

## Listar jogadores

```
GET /players
```

Resultado esperado

HTTP 200

Lista de jogadores.

Resultado

✅ Sucesso

---

## Buscar jogador por ID

```
GET /players/{id}
```

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

## Buscar jogador inexistente

Resultado esperado

HTTP 404

Resultado

✅ Sucesso

---

## Atualizar jogador

```
PUT /players/{id}
```

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

## Excluir jogador

```
DELETE /players/{id}
```

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

# COURTS

## Criar quadra

```
POST /courts
```

JSON

```json
{
  "name": "Arena Central",
  "sport": "FUTSAL",
  "location": "Fortaleza"
}
```

Resultado esperado

HTTP 201

Resultado

✅ Sucesso

---

## Criar quadra com modalidade inválida

Resultado esperado

HTTP 400

Resultado

✅ Sucesso

---

## Criar quadra com nome duplicado

Resultado esperado

HTTP 409

Resultado

✅ Sucesso

---

## Listar quadras

```
GET /courts
```

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

## Buscar quadra

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

## Buscar quadra inexistente

Resultado esperado

HTTP 404

Resultado

✅ Sucesso

---

## Atualizar quadra

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

## Remover quadra

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

# RESERVATIONS

## Criar reserva

```
POST /reservations
```

JSON

```json
{
  "playerId": "ID_DO_JOGADOR",
  "courtId": "ID_DA_QUADRA",
  "date": "2026-08-01",
  "startTime": "18:00",
  "endTime": "19:00"
}
```

Resultado esperado

HTTP 201

Resultado

✅ Sucesso

---

## Criar reserva com jogador inexistente

Resultado esperado

HTTP 404

Resultado

✅ Sucesso

---

## Criar reserva com quadra inexistente

Resultado esperado

HTTP 404

Resultado

✅ Sucesso

---

## Criar reserva com horário inválido

Exemplo

18:00 até 17:00

Resultado esperado

HTTP 400

Resultado

✅ Sucesso

---

## Criar reserva com conflito

Objetivo

Garantir que duas reservas não ocupem a mesma quadra no mesmo horário.

Resultado esperado

HTTP 409

Resultado

✅ Sucesso

---

## Listar reservas

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

## Buscar reserva

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

## Atualizar reserva

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

## Excluir reserva

Resultado esperado

HTTP 200

Resultado

✅ Sucesso

---

# 6. Resumo dos Testes

| Módulo       | Casos executados | Sucesso |
| ------------ | ---------------- | ------- |
| Health       | 1                | ✅      |
| Players      | 9                | ✅      |
| Courts       | 8                | ✅      |
| Reservations | 9                | ✅      |

Total de casos executados

**27 testes**

Todos executados com sucesso.

---

# 7. Conclusão

Após a execução dos testes foi possível validar o funcionamento da API em seus principais fluxos de negócio.

Foram verificados:

- criação de jogadores;
- validação de e-mail duplicado;
- cadastro de quadras;
- validação de modalidade esportiva;
- criação de reservas;
- prevenção de conflitos de horário;
- tratamento de erros;
- respostas HTTP;
- integridade dos dados.

Os resultados demonstram que a API apresenta comportamento consistente tanto para operações bem-sucedidas quanto para cenários de erro, atendendo às regras de negócio implementadas.
