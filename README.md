# MAKE-UP — Sistema Web de Maquiagem

## Sobre o projeto

O **MAKE-UP** é uma aplicação web desenvolvida para oferecer uma experiência prática e organizada de compra de produtos de maquiagem.

O sistema permite visualizar produtos, explorar categorias, gerenciar favoritos e carrinho, realizar pedidos e consultar o histórico de compras.

O projeto utiliza uma arquitetura separada entre frontend e backend, com persistência de dados em PostgreSQL.

## Acesso ao sistema

- **Site:** https://make-up-349y.onrender.com
- **API:** https://make-up-backendmake-up.onrender.com
- **Repositório:** https://github.com/Henrique9mrk/MAKE-UP

## Funcionalidades

- Visualização do catálogo de produtos.
- Navegação por categorias.
- Pesquisa de produtos.
- Cadastro e login de usuários.
- Autenticação.
- Gerenciamento de perfil.
- Gerenciamento de favoritos.
- Carrinho de compras.
- Finalização de pedidos.
- Histórico de compras.

## Tecnologias utilizadas

### Frontend
- React 19.
- Vite.
- JavaScript.
- CSS.
- Axios.
- React Router.
- React Icons.

### Backend
- Node.js.
- Express 5.
- Prisma ORM 6.
- JWT.
- bcrypt.
- Helmet.
- Express Rate Limit.

### Banco de dados
- PostgreSQL.
- Neon (produção).

### Hospedagem
- Render (frontend e backend).
- Neon (banco de dados).

## Estrutura do projeto

```text
MAKE-UP/
├── assets/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── docs/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
├── .gitignore
└── README.md
```

## Pré-requisitos

Para executar o projeto localmente, é necessário ter:

- Node.js e npm.
- Git.
- PostgreSQL.

## Instalação e configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/Henrique9mrk/MAKE-UP.git
cd MAKE-UP
```

### 2. Configurar o banco de dados

Crie um banco de dados PostgreSQL chamado `maquiagem`.

Caso utilize outro nome, atualize a variável `DATABASE_URL` de acordo com sua configuração.

### 3. Configurar o backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

Edite `backend/.env` e configure:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Endereço de conexão com PostgreSQL |
| `JWT_SECRET` | Segredo exclusivo para assinatura dos tokens |
| `PORT` | Porta do backend (padrão: 3000) |
| `FRONTEND_URL` | Endereço do frontend (padrão: http://localhost:5173) |

Gere o Prisma Client:

```bash
npx prisma generate
```

Execute as migrações:

```bash
npx prisma migrate deploy
```

Inicie o backend:

```bash
npm start
```

A API estará disponível em:

```text
http://localhost:3000
```

### 4. Configurar o frontend

Abra outro terminal na raiz do projeto e entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível normalmente em:

```text
http://localhost:5173
```

O endereço padrão da API em desenvolvimento é `http://localhost:3000`.

Para configurar outro endereço, utilize a variável `VITE_API_URL` em um arquivo de ambiente do frontend, como `.env.local`.

## Testes e validação

### Testes automatizados do backend

Na pasta `backend`, execute:

```bash
npm test
```

### Verificação do frontend

Na pasta `frontend`, execute:

```bash
npm run lint
```

Para gerar a versão de produção:

```bash
npm run build
```

Para visualizar a versão compilada:

```bash
npm run preview
```

## Segurança

O projeto possui mecanismos de segurança, incluindo:

- Autenticação por JWT.
- Senhas armazenadas com hash bcrypt.
- Validação dos dados recebidos pela API.
- Proteção de rotas que exigem autenticação.
- Controle de acesso aos pedidos dos usuários.
- Limitação de tentativas de login.
- Helmet para proteção de cabeçalhos HTTP.
- Restrição de origem das requisições por CORS.
- Tratamento centralizado de erros.
- Proteção de arquivos de ambiente pelo `.gitignore`.

**Importante:** nunca publique arquivos `.env`, senhas, tokens JWT ou credenciais do banco de dados no GitHub.

O arquivo `backend/.env.example` contém somente valores de exemplo.

## Ambiente de produção

O sistema está publicado utilizando:

- Frontend e backend hospedados no Render.
- Banco de dados PostgreSQL hospedado no Neon.

Em produção, o frontend utiliza a variável `VITE_API_URL` para se comunicar com o backend.

As credenciais e configurações de produção são mantidas nas variáveis de ambiente dos serviços de hospedagem.

## Status do projeto

O MAKE-UP possui frontend e backend publicados em produção, banco de dados conectado e funcionalidades principais validadas.

O projeto conta com testes automatizados para validação das funcionalidades e regras de segurança do backend.

## Autor

Projeto acadêmico desenvolvido como sistema web de maquiagem.