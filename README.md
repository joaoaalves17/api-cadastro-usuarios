
# API de Cadastro de Usuários

API REST desenvolvida com Node.js e Express para gerenciamento de usuários, utilizando SQLite para armazenamento persistente dos dados.

Projeto desenvolvido para praticar conceitos de desenvolvimento backend, operações CRUD, integração com banco de dados e validação de dados.

## Tecnologias utilizadas

- Node.js
- Express
- SQLite
- Better-SQLite3
- JavaScript

## Funcionalidades

- Cadastrar usuários.
- Listar todos os usuários.
- Atualizar dados de usuários.
- Excluir usuários.
- Validar campos obrigatórios.
- Validar formato de e-mail.
- Impedir cadastro de e-mails duplicados.
- Validar identificadores dos usuários.
- Tratar erros e retornar códigos HTTP apropriados.
- Armazenar dados de forma persistente utilizando SQLite.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | /usuarios | Lista todos os usuários |
| POST | /usuarios | Cadastra um novo usuário |
| PUT | /usuarios/:id | Atualiza um usuário existente |
| DELETE | /usuarios/:id | Exclui um usuário |

## Exemplos de utilização

### 1. Cadastrar usuário

**Método:** POST

**Rota:** `/usuarios`

```json
{
  "nome": "João Silva",
  "email": "joao@email.com"
}
```

### 2. Listar usuários

**Método:** GET

**Rota:** `/usuarios`

Retorna a lista de usuários cadastrados.

### 3. Atualizar usuário

**Método:** PUT

**Rota:** `/usuarios/1`

```json
{
  "nome": "João Atualizado",
  "email": "joaoatualizado@email.com"
}
```

### 4. Excluir usuário

**Método:** DELETE

**Rota:** `/usuarios/1`

Exclui o usuário correspondente ao ID informado.

## Instalação e execução

### Pré-requisitos

- Node.js instalado.
- npm (gerenciador de pacotes do Node.js).

### 1. Clonar o repositório

```bash
git clone https://github.com/joaoaalves17/api-cadastro-usuarios.git
```

### 2. Entrar na pasta do projeto

```bash
cd api-cadastro-usuarios
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o servidor

Modo de desenvolvimento:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Após iniciar, a API estará disponível em:

`http://localhost:3001`

## Estrutura do projeto

```text
api-cadastro-usuarios/
├── src/
│   ├── database/
│   │   └── database.js
│   ├── routes/
│   │   └── usuarios.js
│   └── server.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Objetivo

Este projeto faz parte do meu processo de aprendizado em desenvolvimento backend, com foco na construção de APIs REST utilizando JavaScript e Node.js.

Durante o desenvolvimento, foram aplicados conceitos de manipulação de dados, operações CRUD, validação de informações, tratamento de erros e integração com banco de dados.

---

Desenvolvido para fins de estudo e portfólio.
