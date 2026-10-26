# MAKE-UP — Sistema de Maquiagem

## Sobre o projeto

O MAKE-UP é uma aplicação web de maquiagem que permite visualizar produtos, gerenciar favoritos e carrinho, realizar pedidos e consultar o histórico de compras.

## Tecnologias

- **Frontend:** React, Vite, JavaScript e CSS.
- **Backend:** Node.js, Express e Prisma ORM.
- **Banco de dados:** PostgreSQL.
- **Autenticação:** JWT e bcrypt.

## Estrutura

- `frontend/` — interface web.
- `backend/` — API, autenticação e pedidos.
- `backend/prisma/` — schema e migrações do banco.
- `backend/tests/` — testes automatizados do backend.
- `docs/` — documentação complementar.
- `assets/` — recursos do projeto.

## Pré-requisitos

Instale Node.js, npm, Git e PostgreSQL.

## 1. Obter o projeto

Clone o repositório:

```bash
git clone https://github.com/Henrique9mrk/MAKE-UP.git
cd MAKE-UP
```

## 2. Configurar o banco de dados

Crie um banco PostgreSQL chamado `maquiagem` ou escolha outro nome e use-o na variável `DATABASE_URL`.

Configure as credenciais do PostgreSQL para o seu próprio ambiente.

## 3. Configurar o backend

Entre na pasta do backend:

```bash
cd backend
npm install
```

Crie o arquivo `.env` a partir do modelo:

```bash
cp .env.example .env
```

Edite `backend/.env` e substitua os valores de exemplo:
- `DATABASE_URL`: endereço de conexão do PostgreSQL.
- `JWT_SECRET`: segredo aleatório e exclusivo para o ambiente.

As variáveis `PORT` e `FRONTEND_URL` podem manter os valores padrão para desenvolvimento local.

Gere o cliente Prisma e execute as migrações:

```bash
npx prisma generate
npx prisma migrate deploy
```

Se for necessário preencher o banco com os dados iniciais, consulte as instruções do arquivo `backend/prisma/seed.js` antes de executar qualquer seed.

Inicie a API:

```bash
npm start
```

O backend utiliza a porta `3000` por padrão.

## 4. Configurar o frontend

Abra outro terminal na raiz do projeto e execute:

```bash
cd frontend
npm install
npm run dev
```

O Vite exibirá o endereço local do frontend, normalmente `http://localhost:5173`.

## 5. Testes e validação

Para executar os testes automatizados do backend:

```bash
cd backend
npm test
```

Para verificar o frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Segurança

- Nunca publique o arquivo `backend/.env`.
- Não compartilhe senhas, tokens JWT ou credenciais do banco.
- Use um `JWT_SECRET` exclusivo e forte em cada ambiente.
- O arquivo `backend/.env.example` contém apenas valores de exemplo.

## Status

Projeto em desenvolvimento. Antes de considerar a entrega concluída, valide a instalação em outro computador, o funcionamento do banco, o cadastro, o login, o carrinho, a finalização de pedidos e o histórico de compras.
