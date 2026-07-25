# 🏟️ Sistema de Agendamento de Quadras Esportivas

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-REST_API-black?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-Testes-FF6C37?logo=postman&logoColor=white)
![Status](https://img.shields.io/badge/Status-Concluído-success)

</div>

---

## 📖 Sobre o Projeto

O **Sistema de Agendamento de Quadras Esportivas** é uma API REST desenvolvida como parte do projeto **CURSO: DESENVOLVIMENTO FULL STACK BÁSICO
PROJETO DFS-2026.2**, promovido pelo programa **Atlântico Avanti**.

A aplicação foi criada para centralizar o gerenciamento de **jogadores**, **quadras esportivas** e **reservas**, oferecendo uma solução organizada para o controle de agendamentos e evitando conflitos de horários entre reservas da mesma quadra.

Durante o desenvolvimento foram aplicados conceitos fundamentais de desenvolvimento backend, como arquitetura em camadas, modelagem de banco de dados relacional, persistência utilizando ORM, validações de regras de negócio e testes completos da API utilizando o Postman.

O sistema foi construído seguindo boas práticas de organização do código, separando responsabilidades entre controllers, services, repositories e acesso ao banco de dados, tornando a aplicação mais escalável e de fácil manutenção.

---

# 🎯 Objetivos

O projeto possui como principal objetivo desenvolver uma API REST capaz de atender às necessidades de gerenciamento de um sistema de reservas de quadras esportivas.

Entre os objetivos específicos estão:

- Disponibilizar uma API organizada seguindo o padrão REST;
- Permitir o cadastro completo de jogadores;
- Permitir o cadastro completo de quadras esportivas;
- Gerenciar reservas entre jogadores e quadras;
- Impedir conflitos de horários automaticamente;
- Garantir a integridade dos dados armazenados;
- Utilizar um banco de dados relacional através do Prisma ORM;
- Aplicar boas práticas de arquitetura backend;
- Realizar testes completos dos endpoints utilizando o Postman.

---

# ✨ Principais Funcionalidades

A API oferece suporte às seguintes operações:

### 👤 Gerenciamento de Jogadores

- Cadastro de novos jogadores;
- Consulta individual por ID;
- Listagem completa de jogadores;
- Atualização dos dados cadastrais;
- Exclusão de jogadores.

---

### 🏟️ Gerenciamento de Quadras

- Cadastro de quadras esportivas;
- Consulta individual por ID;
- Listagem de quadras disponíveis;
- Atualização das informações da quadra;
- Exclusão de quadras.

---

### 📅 Gerenciamento de Reservas

- Criação de reservas;
- Consulta de reservas cadastradas;
- Atualização de reservas;
- Cancelamento de reservas;
- Associação entre jogadores e quadras.

---

### ⚡ Regras de Negócio

Durante a criação de uma reserva, o sistema realiza automaticamente validações para garantir que:

- Não existam duas reservas para a mesma quadra no mesmo horário;
- Apenas jogadores e quadras válidos possam ser utilizados nas reservas;
- Os dados enviados atendam às validações definidas pela aplicação.

---

# 📑 Sumário

- [📖 Sobre o Projeto](#-sobre-o-projeto)
- [🎯 Objetivos](#-objetivos)
- [✨ Principais Funcionalidades](#-principais-funcionalidades)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🏛️ Arquitetura da Aplicação](#️-arquitetura-da-aplicação)
- [🗄️ Banco de Dados](#️-banco-de-dados)
- [📚 Modelo das Entidades](#-modelo-das-entidades)
- [⚡ Regras de Negócio](#-regras-de-negócio)
- [📡 Endpoints da API](#-endpoints-da-api)
- [🚀 Como Executar o Projeto](#-como-executar-o-projeto)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [🧪 Testes da API](#-testes-da-api)
- [👥 Equipe](#-equipe)
- [🔮 Melhorias Futuras](#-melhorias-futuras)
- [📌 Status do Projeto](#-status-do-projeto)

---

# 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando tecnologias amplamente adotadas no desenvolvimento de APIs REST modernas. Cada ferramenta foi escolhida com o objetivo de proporcionar organização, desempenho e facilidade de manutenção do código.

| Tecnologia     | Finalidade                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Node.js**    | Ambiente de execução JavaScript utilizado para executar o servidor backend.                                         |
| **Express.js** | Framework responsável pela criação das rotas, gerenciamento das requisições HTTP e organização da API.              |
| **Prisma ORM** | Responsável pela comunicação entre a aplicação e o banco de dados, além do gerenciamento das migrações.             |
| **PostgreSQL** | Sistema Gerenciador de Banco de Dados Relacional (SGBD) utilizado para armazenar todas as informações da aplicação. |
| **Postman**    | Ferramenta utilizada para desenvolvimento, validação e testes dos endpoints da API.                                 |
| **Git**        | Sistema de controle de versão utilizado durante o desenvolvimento colaborativo.                                     |
| **GitHub**     | Plataforma utilizada para hospedagem e versionamento do projeto.                                                    |

---

# 🏛️ Arquitetura da Aplicação

A API foi construída seguindo uma arquitetura em camadas (**Layered Architecture**), onde cada componente possui uma responsabilidade específica.

Essa separação torna o projeto mais organizado, facilita a manutenção, reduz o acoplamento entre os módulos e simplifica futuras evoluções da aplicação.

O fluxo de uma requisição ocorre conforme o diagrama abaixo.

```mermaid
flowchart TD

A[Cliente / Postman]

B[Express Routes]

C[Controllers]

D[Services]

E[Repositories]

F[Prisma ORM]

G[(PostgreSQL)]

A --> B
B --> C
C --> D
D --> E
E --> F
F --> G
```

---

## 📌 Routes

As rotas representam o ponto de entrada da aplicação.

São responsáveis por receber as requisições HTTP e encaminhá-las ao controller correspondente.

Exemplos:

- GET /players
- POST /players
- GET /courts
- POST /reservations

As rotas não possuem regras de negócio.

Sua única responsabilidade é direcionar corretamente a requisição.

---

## 📌 Controllers

Os controllers atuam como intermediários entre as rotas e a camada de serviços.

São responsáveis por:

- Receber os dados enviados pelo cliente;
- Chamar o service correspondente;
- Retornar a resposta HTTP adequada.

Os controllers não realizam acesso direto ao banco de dados.

---

## 📌 Services

A camada de serviços concentra toda a lógica de negócio da aplicação.

Entre suas responsabilidades estão:

- Validação de dados;
- Aplicação das regras de negócio;
- Verificação de conflitos de horários;
- Tratamento de exceções;
- Coordenação entre controllers e repositories.

Essa camada garante que todas as regras do sistema sejam aplicadas antes da persistência dos dados.

---

## 📌 Repositories

Os repositories são responsáveis pela comunicação direta com o banco de dados.

Nessa camada ficam concentradas as operações de:

- Inserção de registros;
- Atualização de registros;
- Exclusão de registros;
- Consultas ao banco de dados.

Os repositories não contêm regras de negócio, apenas operações de persistência.

---

## 📌 Prisma ORM

O Prisma ORM atua como intermediário entre a aplicação e o PostgreSQL.

Suas principais funções são:

- Mapear as entidades do sistema;
- Gerenciar migrações;
- Executar consultas SQL de forma segura;
- Reduzir a necessidade de escrita manual de comandos SQL.

---

## 📌 PostgreSQL

O PostgreSQL é o banco de dados relacional utilizado pelo projeto.

Nele são armazenadas todas as informações referentes aos:

- Jogadores;
- Quadras;
- Reservas.

Além da persistência dos dados, o PostgreSQL garante integridade referencial entre as tabelas através das chaves primárias e estrangeiras.

---

# 🎯 Benefícios da Arquitetura Utilizada

A adoção da arquitetura em camadas oferece diversas vantagens para o projeto.

Entre elas destacam-se:

- Separação de responsabilidades;
- Código mais organizado;
- Facilidade para manutenção;
- Maior reutilização de componentes;
- Melhor legibilidade;
- Facilidade para implementação de testes;
- Escalabilidade da aplicação;
- Baixo acoplamento entre as camadas.

Essa organização permite que novas funcionalidades sejam adicionadas futuramente com menor impacto sobre o restante da aplicação.

---

# 📁 Estrutura do Projeto

A organização das pastas segue o padrão recomendado para aplicações Node.js utilizando arquitetura em camadas, mantendo uma separação clara entre configuração, regras de negócio, acesso aos dados, documentação e testes da API.

````text
quadra-livre/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
│
├── docs/
│   ├── evidencias/
│   │   └── Relatorio_Testes_API_Quadra_Livre.pdf
│   ├── arquitetura.md
│   ├── BANCO-DE-DADOS.md
│   ├── INSTALACAO.md
│   └── TESTES.md
│
├── postman/
│   └── Quadra Livre API.postman_collection.json
│
├── CHANGELOG.md
└── README.md

---

# 🗄️ Banco de Dados

O Sistema de Agendamento de Quadras Esportivas utiliza o **PostgreSQL** como Sistema Gerenciador de Banco de Dados Relacional (SGBD).

Toda a persistência das informações é realizada por meio do **Prisma ORM**, responsável por mapear as entidades da aplicação, gerar migrações e facilitar a comunicação entre o backend e o banco de dados.

O modelo foi projetado para garantir integridade referencial entre jogadores, quadras e reservas, permitindo consultas eficientes e evitando inconsistências durante o cadastro de novos agendamentos.

---

# 🏛️ Modelo Entidade-Relacionamento (ER)

O banco é composto por três entidades principais:

- **Players** — jogadores cadastrados no sistema;
- **Courts** — quadras esportivas disponíveis para reserva;
- **Reservations** — reservas realizadas pelos jogadores.

A entidade **Reservations** atua como ligação entre jogadores e quadras, armazenando todas as informações referentes aos agendamentos.

```mermaid
erDiagram

    PLAYERS ||--o{ RESERVATIONS : realiza
    COURTS  ||--o{ RESERVATIONS : possui

    PLAYERS {
        String id PK
        String name
        String email
        String phone
    }

    COURTS {
        String id PK
        String name
        SportType sport
        String location
    }

    RESERVATIONS {
        String id PK
        String playerId FK
        String courtId FK
        DateTime date
        DateTime startTime
        DateTime endTime
    }
````

---

# 🔗 Relacionamentos

O relacionamento entre as entidades segue a seguinte lógica:

- Um **jogador** pode realizar várias reservas;
- Uma **quadra** pode receber várias reservas ao longo do tempo;
- Cada **reserva** pertence a apenas um jogador e a uma única quadra.

Visualmente:

```text
Player
   │
   ├──────────────┐
   │              │
Reserva        Reserva
   │              │
   └──────────────┘
        │
      Quadra
```

---

# 📚 Entidade Players

A tabela **Players** armazena as informações dos jogadores cadastrados na aplicação.

Cada jogador possui um identificador único e pode realizar diversas reservas.

| Campo | Tipo | Restrição        | Descrição                      |
| ----- | ---- | ---------------- | ------------------------------ |
| id    | UUID | PK               | Identificador único do jogador |
| name  | Text | NOT NULL         | Nome completo                  |
| email | Text | UNIQUE, NOT NULL | E-mail utilizado para contato  |
| phone | Text | NOT NULL         | Número de telefone             |

---

## Exemplo de Registro

```json
{
  "id": "0b4bfa55-9c45-4a56-a7f2-31cbf19dfd31",
  "name": "Pedro Giffoni",
  "email": "pedro@email.com",
  "phone": "(85)99999-9999"
}
```

---

# 🏟️ Entidade Courts

A tabela **Courts** representa as quadras esportivas disponíveis para reserva.

Cada registro identifica uma quadra, sua modalidade esportiva e sua localização.

| Campo    | Tipo | Restrição | Descrição               |
| -------- | ---- | --------- | ----------------------- |
| id       | UUID | PK        | Identificador da quadra |
| name     | Text | NOT NULL  | Nome da quadra          |
| sport    | Enum | NOT NULL  | Modalidade esportiva    |
| location | Text | NOT NULL  | Localização física      |

---

## Modalidades Suportadas

A API trabalha com modalidades esportivas pré-definidas.

Exemplos:

- FUTSAL
- VOLLEYBALL
- TENNIS
- SOCCER
- BASKETBALL
- TENNIS
- BEACH_TENNIS
- OTHER

Esses valores são utilizados para padronizar os dados cadastrados e evitar inconsistências.

---

## Exemplo de Registro

```json
{
  "id": "bcf9fd4c-3d12-498d-b43e-5f4892d1f931",
  "name": "Quadra Central",
  "sport": "FUTSAL",
  "location": "Bloco A"
}
```

---

# 📅 Entidade Reservations

A tabela **Reservations** registra todos os agendamentos realizados pelos jogadores.

Cada reserva está associada a um jogador e a uma quadra específica.

Além disso, são armazenadas a data e os horários de início e término da reserva.

| Campo     | Tipo     | Restrição | Descrição                |
| --------- | -------- | --------- | ------------------------ |
| id        | UUID     | PK        | Identificador da reserva |
| playerId  | UUID     | FK        | Referência ao jogador    |
| courtId   | UUID     | FK        | Referência à quadra      |
| date      | DateTime | NOT NULL  | Data da reserva          |
| startTime | DateTime | NOT NULL  | Horário inicial          |
| endTime   | DateTime | NOT NULL  | Horário final            |

---

## Exemplo de Registro

```json
{
  "id": "2d4d54c8-1b7e-43df-9f6f-4c019c3fd998",
  "playerId": "0b4bfa55-9c45-4a56-a7f2-31cbf19dfd31",
  "courtId": "bcf9fd4c-3d12-498d-b43e-5f4892d1f931",
  "date": "2026-07-22",
  "startTime": "14:00",
  "endTime": "16:00"
}
```

---

# 🔒 Integridade Referencial

O banco de dados utiliza **chaves primárias (Primary Keys)** e **chaves estrangeiras (Foreign Keys)** para manter a consistência das informações.

As regras implementadas garantem que:

- Não exista uma reserva sem um jogador válido;
- Não exista uma reserva sem uma quadra válida;
- Os relacionamentos entre as tabelas permaneçam consistentes;
- Cada registro seja identificado por um UUID exclusivo.

---

# ⚙️ Prisma ORM

O Prisma ORM foi utilizado como camada de acesso ao banco de dados.

Entre suas principais responsabilidades estão:

- Mapeamento das entidades da aplicação;
- Geração automática das migrações;
- Criação das tabelas no PostgreSQL;
- Execução de consultas SQL de forma segura;
- Abstração da camada de persistência;
- Manutenção da integridade entre as entidades.

Essa abordagem reduz a quantidade de código SQL manual e torna a aplicação mais organizada, segura e de fácil manutenção.

---

# ⚡ Regras de Negócio

Além das operações de cadastro, consulta, atualização e exclusão, a API implementa regras de negócio para garantir a consistência dos dados e impedir operações inválidas.

Essas validações são executadas na camada de **Services**, antes que qualquer alteração seja persistida no banco de dados.

---

# 📌 Cadastro de Jogadores

Durante o cadastro de um jogador, a aplicação verifica:

- Nome obrigatório;
- E-mail obrigatório;
- Telefone obrigatório;
- E-mail único no sistema.

Caso um jogador tente utilizar um e-mail já cadastrado, a API retorna um erro informando que o registro já existe.

Exemplo:

```text
Nome: Pedro Giffoni

Email: pedro@email.com

Telefone: (85)99999-9999
```

Caso outro jogador tente utilizar o mesmo e-mail:

```text
Nome: João

Email: pedro@email.com
```

Resultado:

```http
409 Conflict
```

---

# 📌 Cadastro de Quadras

Para cadastrar uma quadra é necessário informar:

- Nome;
- Modalidade esportiva;
- Localização.

Exemplo:

```json
{
  "name": "Quadra Central",
  "sport": "FUTSAL",
  "location": "Bloco A"
}
```

A API também valida os tipos de modalidade esportiva permitidos.

---

# 📌 Cadastro de Reservas

O cadastro de reservas representa a principal regra de negócio da aplicação.

Antes de salvar uma nova reserva, a API verifica automaticamente:

- existência do jogador;
- existência da quadra;
- validade dos horários;
- conflitos com reservas existentes.

Somente após todas as validações a reserva é persistida no banco de dados.

---

# 🚫 Validação de Conflitos de Horário

A aplicação impede que duas reservas sejam realizadas para a mesma quadra em horários sobrepostos.

Para isso, é aplicada a seguinte regra:

```
Novo Início < Fim Existente

E

Novo Fim > Início Existente
```

Quando ambas as condições forem verdadeiras, existe conflito.

---

## Exemplo 1

Reserva existente:

```text
14:00 ─────────────── 16:00
```

Nova tentativa:

```text
15:00 ─────────────── 17:00
```

Resultado:

```http
409 Conflict
```

---

## Exemplo 2

Reserva existente:

```text
14:00 ─────────────── 16:00
```

Nova tentativa:

```text
16:00 ─────────────── 18:00
```

Resultado:

```http
201 Created
```

Como não existe sobreposição entre os horários, a reserva é permitida.

---

# 📡 Endpoints da API

A API segue o padrão REST e organiza seus recursos em três grupos principais:

- Players
- Courts
- Reservations

Todos os endpoints retornam respostas em formato JSON.

---

# ❤️ Health Check

Endpoint utilizado para verificar se a aplicação está em funcionamento.

| Método | Endpoint  |
| ------ | --------- |
| GET    | `/health` |

### Resposta

```json
{
  "success": true,
  "message": "API funcionando corretamente."
}
```

---

# 👤 Players

## Listar jogadores

| Método | Endpoint   |
| ------ | ---------- |
| GET    | `/players` |

Retorna todos os jogadores cadastrados.

---

## Buscar jogador por ID

| Método | Endpoint        |
| ------ | --------------- |
| GET    | `/players/{id}` |

Retorna um único jogador.

Caso o ID não exista:

```http
404 Not Found
```

---

## Cadastrar jogador

| Método | Endpoint   |
| ------ | ---------- |
| POST   | `/players` |

### Body

```json
{
  "name": "Pedro Giffoni",
  "email": "pedro@email.com",
  "phone": "(85)99999-9999"
}
```

Resposta:

```http
201 Created
```

---

## Atualizar jogador

| Método | Endpoint        |
| ------ | --------------- |
| PUT    | `/players/{id}` |

Atualiza os dados de um jogador previamente cadastrado.

---

## Excluir jogador

| Método | Endpoint        |
| ------ | --------------- |
| DELETE | `/players/{id}` |

Remove permanentemente um jogador.

---

# 🏟️ Courts

## Listar quadras

| Método | Endpoint  |
| ------ | --------- |
| GET    | `/courts` |

---

## Buscar quadra por ID

| Método | Endpoint       |
| ------ | -------------- |
| GET    | `/courts/{id}` |

---

## Cadastrar quadra

| Método | Endpoint  |
| ------ | --------- |
| POST   | `/courts` |

### Body

```json
{
  "name": "Quadra Central",
  "sport": "FUTSAL",
  "location": "Bloco A"
}
```

---

## Atualizar quadra

| Método | Endpoint       |
| ------ | -------------- |
| PUT    | `/courts/{id}` |

---

## Excluir quadra

| Método | Endpoint       |
| ------ | -------------- |
| DELETE | `/courts/{id}` |

---

# 📅 Reservations

## Listar reservas

| Método | Endpoint        |
| ------ | --------------- |
| GET    | `/reservations` |

Retorna todas as reservas cadastradas.

---

## Buscar reserva por ID

| Método | Endpoint             |
| ------ | -------------------- |
| GET    | `/reservations/{id}` |

---

## Criar reserva

| Método | Endpoint        |
| ------ | --------------- |
| POST   | `/reservations` |

### Body

```json
{
  "playerId": "UUID_DO_JOGADOR",
  "courtId": "UUID_DA_QUADRA",
  "date": "2026-07-25",
  "startTime": "14:00",
  "endTime": "16:00"
}
```

Se não houver conflito de horários:

```http
201 Created
```

Caso exista conflito:

```http
409 Conflict
```

---

## Atualizar reserva

| Método | Endpoint             |
| ------ | -------------------- |
| PUT    | `/reservations/{id}` |

Permite alterar a data, horário ou quadra da reserva, respeitando as regras de conflito.

---

## Excluir reserva

| Método | Endpoint             |
| ------ | -------------------- |
| DELETE | `/reservations/{id}` |

Cancela a reserva selecionada.

---

# 📄 Códigos de Resposta HTTP

| Código                        | Significado                                                           |
| ----------------------------- | --------------------------------------------------------------------- |
| **200 OK**                    | Operação realizada com sucesso.                                       |
| **201 Created**               | Recurso criado com sucesso.                                           |
| **400 Bad Request**           | Dados inválidos enviados pelo cliente.                                |
| **404 Not Found**             | Recurso solicitado não encontrado.                                    |
| **409 Conflict**              | Conflito de dados, como e-mail duplicado ou sobreposição de reservas. |
| **500 Internal Server Error** | Erro interno inesperado da aplicação.                                 |

---

# 🔐 Padronização das Respostas

Todas as respostas da API seguem um padrão para facilitar o consumo pelos clientes.

### Sucesso

```json
{
  "success": true,
  "message": "Operação realizada com sucesso.",
  "data": {}
}
```

### Erro

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição do erro."
  }
}
```

Esse padrão torna a comunicação entre cliente e servidor mais consistente, facilitando o tratamento de respostas em aplicações frontend e integrações futuras.

---

# 🚀 Como Executar o Projeto

## 📋 Pré-requisitos

Antes de executar a aplicação, certifique-se de possuir os seguintes softwares instalados em sua máquina:

- Node.js (versão 18 ou superior)
- PostgreSQL
- Git
- npm
- Prisma CLI (instalado junto às dependências do projeto)

É recomendado utilizar também:

- Visual Studio Code
- Postman

---

# 📥 Clonando o Repositório

Clone o projeto utilizando o Git.

```bash
git clone https://github.com/Squad-5-Bootcamp-Avanti/quadra-livre
```

Entre na pasta do projeto.

```bash
cd quadra-livre

cd backend
```

---

# 📦 Instalando as Dependências

Execute:

```bash
npm install
```

Esse comando instalará todas as bibliotecas necessárias para execução da API.

---

# ⚙️ Configuração das Variáveis de Ambiente

Crie um arquivo chamado **.env** na raiz do projeto. use o env.example como referência para definir as variáveis de ambiente necessárias.

Exemplo:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/quadras_esportivas?schema=public"

PORT=3333
```

> **Importante:** substitua `SUA_SENHA` pela senha configurada no seu PostgreSQL.

---

# 🗄️ Executando as Migrações

Após configurar o banco de dados, execute:

```bash
npx prisma migrate dev
```

Esse comando será responsável por:

- Criar o banco de dados (caso ainda não exista);
- Executar todas as migrações;
- Criar as tabelas;
- Atualizar o Prisma Client.

---

# ▶️ Iniciando a Aplicação

Execute:

```bash
npm run dev
```

O servidor será iniciado na porta configurada no arquivo `.env`.

Por padrão:

```
http://localhost:3333
```

---

# 🔍 Health Check

Após iniciar a aplicação, verifique se ela está funcionando corretamente.

Requisição:

```http
GET /health
```

Resposta esperada:

```json
{
  "success": true,
  "message": "API funcionando corretamente."
}
```

---

# 🧪 Testes da API

Todos os endpoints da aplicação foram testados utilizando o **Postman**.

Foram realizados testes positivos e negativos para validar o comportamento da API.

## ✔️ Testes realizados

### Health

- Health Check

### Players

- Criar jogador
- Buscar jogador por ID
- Listar jogadores
- Atualizar jogador
- Remover jogador
- Buscar jogador inexistente
- Cadastro com e-mail duplicado
- Cadastro com dados inválidos

### Courts

- Criar quadra
- Buscar quadra por ID
- Listar quadras
- Atualizar quadra
- Remover quadra
- Buscar quadra inexistente
- Cadastro com dados inválidos

### Reservations

- Criar reserva
- Buscar reserva por ID
- Listar reservas
- Atualizar reserva
- Remover reserva
- Buscar reserva inexistente
- Criar reserva com conflito de horário
- Cadastro com dados inválidos

---

# 📸 Evidências dos Testes

As capturas de tela dos testes encontram-se na pasta:

```
evidencias/Relatorio_Testes_API_Quadra_Livre.pdf

relatório contendo as evidências da execução dos testes realizados.

---

# 📂 Collection do Postman

A collection utilizada para validar todos os endpoints encontra-se em:

```

postman/

````

A collection contempla todos os cenários de teste implementados na aplicação.

---

# 👥 Equipe

| Integrante        | Responsabilidade                                                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Fernanda          | Tech Lead, configuração inicial do projeto, modelagem do banco de dados e integração com Prisma ORM                                       |
| Carol             | Desenvolvimento do CRUD de Players                                                                                                        |
| Desire            | Desenvolvimento do CRUD de Courts                                                                                                         |
| Lili e Diego      | Desenvolvimento do CRUD de Reservations e implementação da validação de conflitos                                                         |
| Pedro Giffoni | Planejamento e execução dos testes da API, validação dos endpoints, criação da Collection do Postman e elaboração da documentação técnica |

---

# 🔮 Melhorias Futuras

Embora o projeto atenda aos requisitos propostos para o entregável, existem diversas melhorias que podem ser implementadas em versões futuras.

Entre elas:

- Autenticação utilizando JWT;
- Controle de permissões por perfil de usuário;
- Documentação automática com Swagger/OpenAPI;
- Containerização utilizando Docker;
- Pipeline de Integração Contínua (CI/CD);
- Deploy em ambiente de produção;
- Testes automatizados com Jest;
- Paginação em listagens;
- Filtros avançados para reservas;
- Upload de imagens para quadras;
- Cadastro de torneios e campeonatos;
- Notificações por e-mail para confirmação de reservas;
- Dashboard administrativo.

---

# 📚 Aprendizados

Durante o desenvolvimento deste projeto foi possível aplicar conhecimentos relacionados a:

- Desenvolvimento de APIs REST;
- Organização de aplicações em camadas;
- Express.js;
- Prisma ORM;
- PostgreSQL;
- Relacionamentos em banco de dados;
- Regras de negócio;
- Tratamento de erros;
- Versionamento utilizando Git e GitHub;
- Testes de APIs com Postman;
- Documentação técnica em Markdown.

---

# 📌 Status do Projeto

> ✅ **Concluído**

Este projeto foi desenvolvido como parte do entregável da disciplina **Backend & Banco de Dados** do programa **DFS-2026.2 — Atlântico Avanti**.

Todos os requisitos obrigatórios propostos para esta etapa foram implementados e validados por meio de testes funcionais.

---

# 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos e educacionais.

Seu código pode ser utilizado como material de estudo e referência para aprendizagem de desenvolvimento backend utilizando Node.js, Express, Prisma ORM e PostgreSQL.

---

# 🚀 Deploy

Embora este projeto tenha sido desenvolvido para fins acadêmicos, sua arquitetura permite que seja implantado em ambientes de produção com poucas adaptações.

Algumas plataformas compatíveis:

- Render
- Railway
- Fly.io
- DigitalOcean
- AWS EC2
- Google Cloud Platform
- Microsoft Azure

Antes do deploy recomenda-se:

- Configurar corretamente as variáveis de ambiente;
- Utilizar um banco PostgreSQL hospedado;
- Configurar HTTPS;
- Configurar backups automáticos;
- Ativar logs da aplicação;
- Configurar monitoramento.

---

# 🔐 Segurança

Durante o desenvolvimento foram consideradas boas práticas para minimizar inconsistências e falhas na aplicação.

Entre elas destacam-se:

- Validação dos dados recebidos;
- Tratamento centralizado de exceções;
- Separação entre regras de negócio e acesso ao banco;
- Utilização de UUID como identificador das entidades;
- Uso do Prisma ORM para evitar SQL Injection;
- Organização da aplicação em camadas.

Em uma futura evolução recomenda-se implementar:

- Autenticação JWT;
- Refresh Token;
- Criptografia de senhas com bcrypt;
- Rate Limiting;
- CORS configurável;
- Helmet;
- Logs de auditoria.

---

# 📊 Escalabilidade

A arquitetura escolhida facilita a evolução da aplicação.

Novas funcionalidades podem ser adicionadas sem grandes alterações na estrutura existente.

Exemplos:

- Cadastro de usuários administradores;
- Sistema de autenticação;
- Cadastro de campeonatos;
- Agenda semanal;
- Upload de imagens;
- Pagamentos online;
- Ranking de jogadores;
- Histórico de reservas;
- Dashboard administrativo;
- Integração com aplicativos mobile.

---

# 🧪 Qualidade do Projeto

Durante o desenvolvimento foram seguidas práticas que contribuem para a qualidade do software.

Entre elas:

- Arquitetura em camadas;
- Organização modular;
- Código reutilizável;
- Separação de responsabilidades;
- Padrão Repository;
- Padronização das respostas da API;
- Tratamento de erros;
- Documentação completa;
- Testes manuais dos endpoints.

---

# 📋 Checklist do Projeto

## Backend

- [x] CRUD Players
- [x] CRUD Courts
- [x] CRUD Reservations

---

## Banco de Dados

- [x] PostgreSQL
- [x] Prisma ORM
- [x] Relacionamentos
- [x] Migrações

---

## API

- [x] REST
- [x] JSON
- [x] Tratamento de erros
- [x] Validação de conflitos

---

## Testes

- [x] Health Check
- [x] Players
- [x] Courts
- [x] Reservations
- [x] Casos de erro
- [x] Conflitos de reserva

---

## Documentação

- [x] README
- [x] Diagramas
- [x] Modelo de Dados
- [x] Arquitetura
- [x] Endpoints
- [x] Guia de Instalação
- [x] Guia de Testes

---

# ❓ Perguntas Frequentes (FAQ)

## Qual banco de dados foi utilizado?

PostgreSQL.

---

## Qual ORM foi utilizado?

Prisma ORM.

---

## Como executar as migrações?

```bash
npx prisma migrate dev
````

---

## Como iniciar o servidor?

```bash
npm run dev
```

---

## Como testar a API?

Importe a Collection disponível na pasta `postman/` e execute os endpoints utilizando o Postman.

---

## Onde estão as evidências dos testes?

Na pasta:

```text
evidencias/
```

---

## A API impede reservas duplicadas?

Sim.

Antes de criar uma nova reserva, a aplicação verifica automaticamente se existe sobreposição de horários para a mesma quadra na mesma data.

---

# 📝 Considerações Finais

O desenvolvimento deste projeto permitiu aplicar, de forma prática, conceitos fundamentais de desenvolvimento backend utilizando Node.js, Express, Prisma ORM e PostgreSQL.

Ao longo da implementação foram explorados temas como arquitetura em camadas, modelagem de banco de dados, criação de APIs REST, validação de regras de negócio, persistência de dados, tratamento de erros e documentação técnica.

Além da implementação das funcionalidades solicitadas, também foram realizados testes completos dos endpoints utilizando o Postman, garantindo que os principais cenários de uso fossem validados.

Este projeto representa uma aplicação funcional, organizada e preparada para evoluções futuras, servindo como base para estudos e para o desenvolvimento de sistemas mais robustos.

---

# 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos como parte do programa **DFS-2026.2 – Atlântico Avanti**.

O código pode ser utilizado como referência para estudos sobre desenvolvimento de APIs REST utilizando Node.js, Express, Prisma ORM e PostgreSQL.

---

<div align="center">

# 🏟️ Sistema de Agendamento de Quadras Esportivas

### Backend REST desenvolvido com Node.js, Express, Prisma ORM e PostgreSQL

**Projeto desenvolvido para o programa Atlântico Avanti – DFS-2026.2**

**Equipe Squad 5**

⭐ Obrigado por visitar este repositório!

</div>
