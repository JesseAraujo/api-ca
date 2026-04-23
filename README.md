# API Node + MySQL (phpMyAdmin)

Projeto Node.js com Express para conectar no banco `je189758_GppApp` e fornecer CRUD para as tabelas do dump SQL.

## 1) Configurar variáveis de ambiente

1. Copie `.env.example` para `.env`.
2. Preencha a senha real em `DB_PASSWORD`.

Exemplo:

```env
PORT=3000
DB_HOST=192.96.217.170
DB_PORT=3306
DB_USER=je189758
DB_PASSWORD=SUA_SENHA
DB_NAME=je189758_GppApp
```

## 2) Importar o dump no phpMyAdmin

Importe `sql/je189758_GppApp_1776966237.sql` no banco `je189758_GppApp`.

## 3) Rodar projeto

```bash
npm install
npm run dev
```

Ou em produção:

```bash
npm start
```

## 4) Deploy na Vercel

Este projeto já está preparado para Vercel com:

- `api/index.js` (entrypoint serverless)
- `vercel.json` (roteamento de todas as rotas para o Express)

### Variáveis de ambiente na Vercel

No painel da Vercel, configure:

- `DB_HOST=192.96.217.170`
- `DB_PORT=3306`
- `DB_USER=je189758`
- `DB_PASSWORD=SUA_SENHA`
- `DB_NAME=je189758_GppApp`

`PORT` não é necessário na Vercel.

### Publicar

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## 5) Endpoints

- `GET /health`
- `GET|POST /api/desertos`
- `GET|PUT|DELETE /api/desertos/:id`
- `GET|POST /api/fiscalizacoes`
- `GET|PUT|DELETE /api/fiscalizacoes/:id`
- `GET|POST /api/indeferimentos`
- `GET|PUT|DELETE /api/indeferimentos/:id`
- `GET|POST /api/users`
- `GET|PUT|DELETE /api/users/:id`
- `GET|POST /api/rate-limits`
- `GET|PUT|DELETE /api/rate-limits/:scope/:ip_hash`

## 6) Observações

- Para `users`, o campo `password_hash` é aceito em `POST/PUT`, mas não é retornado no `GET`.
- Para registros com chave primária em `id`, envie `id` no `POST`.
- Em `rate_limits`, a chave primária é composta por `scope` + `ip_hash`.
