# API de Cadastro de Usuários

API REST desenvolvida com **Node.js e Express** para gerenciamento de usuários, utilizando SQLite para armazenamento persistente, autenticação JWT e criptografia de senhas.

O projeto foi desenvolvido com o objetivo de praticar conceitos de desenvolvimento backend, construção de APIs REST, operações CRUD, integração com banco de dados, autenticação e testes automatizados.

## Tecnologias utilizadas

- Node.js
- Express
- JavaScript
- SQLite
- Better-SQLite3
- bcrypt
- JSON Web Token (JWT)
- dotenv
- Supertest
- Node.js Test Runner

## Funcionalidades

- Cadastro de usuários.
- Listagem de usuários.
- Atualização de dados.
- Exclusão de usuários.
- Validação de campos obrigatórios.
- Validação do formato de e-mail.
- Prevenção de e-mails duplicados.
- Criptografia de senhas utilizando bcrypt.
- Autenticação de usuários utilizando JWT.
- Proteção de rotas por meio de middleware.
- Validação de tokens de autenticação.
- Tratamento de erros e utilização de códigos HTTP apropriados.
- Armazenamento persistente com SQLite.
- Testes automatizados das funcionalidades e regras de autenticação.

## Endpoints

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/usuarios` | Cadastrar usuário | Não |
| POST | `/auth/login` | Realizar login | Não |
| GET | `/usuarios` | Listar usuários | Sim |
| PUT | `/usuarios/:id` | Atualizar usuário | Sim |
| DELETE | `/usuarios/:id` | Excluir usuário | Sim |

As rotas protegidas exigem um token JWT no cabeçalho da requisição:

`Authorization: Bearer SEU_TOKEN`

## Exemplos de utilização

### 1. Cadastrar usuário

**Método:** POST

**Rota:** `/usuarios`

Corpo da requisição:

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "Senha123"
}
```

A senha é armazenada no banco de dados em formato criptografado por meio do bcrypt.

### 2. Realizar login

**Método:** POST

**Rota:** `/auth/login`

Corpo da requisição:

```json
{
  "email": "joao@email.com",
  "senha": "Senha123"
}
```

Após a validação das credenciais, a API retorna um token JWT com validade de uma hora.

### 3. Listar usuários

**Método:** GET

**Rota:** `/usuarios`

Requer autenticação JWT.

Retorna a lista de usuários cadastrados, sem expor as senhas ou seus hashes.

### 4. Atualizar usuário

**Método:** PUT

**Rota:** `/usuarios/1`

Requer autenticação JWT.

Corpo da requisição:

```json
{
  "nome": "João Atualizado",
  "email": "joaoatualizado@email.com"
}
```

### 5. Excluir usuário

**Método:** DELETE

**Rota:** `/usuarios/1`

Requer autenticação JWT.

Exclui o usuário correspondente ao identificador informado.

## Autenticação e segurança

A API utiliza JSON Web Token (JWT) para controlar o acesso às rotas protegidas.

As senhas dos usuários são criptografadas com bcrypt antes de serem armazenadas no banco de dados.

A chave utilizada para assinar os tokens é configurada por meio de uma variável de ambiente, evitando deixar informações sensíveis diretamente no código-fonte.

## Instalação e execução

### Pré-requisitos

- Node.js instalado.
- npm.
- Git.

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

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure:

```env
JWT_SECRET=sua_chave_secreta
```

Utilize uma chave secreta forte e mantenha o arquivo `.env` fora do Git.

### 5. Iniciar o servidor

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

## Testes automatizados

O projeto utiliza o Node.js Test Runner e Supertest para executar testes automatizados.

Para executar:

```bash
npm test
```

Os testes verificam:

- Cadastro de usuários.
- Listagem de usuários.
- Atualização e exclusão.
- Validação de dados.
- Prevenção de e-mails duplicados.
- Identificadores inválidos e usuários inexistentes.
- Login com credenciais válidas.
- Rejeição de senhas incorretas.
- Bloqueio de requisições sem token.
- Rejeição de tokens inválidos.

Os testes utilizam um banco de dados em memória, evitando alterações no banco de dados utilizado pela aplicação.

## Estrutura do projeto

```text
api-cadastro-usuarios/
├── src/
│   ├── controllers/
│   │   ├── usuariosController.js
│   │   └── authController.js
│   ├── database/
│   │   └── database.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── usuarios.js
│   │   └── auth.js
│   └── server.js
├── tests/
│   └── usuarios.test.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Objetivo do projeto

Este projeto faz parte do meu processo de desenvolvimento e aprendizado na área de programação, com foco em backend utilizando Node.js.

Durante sua construção, foram praticados conceitos de APIs REST, operações CRUD, banco de dados SQL, autenticação, criptografia de senhas, organização de código e testes automatizados.

---

Desenvolvido para fins de estudo e portfólio.