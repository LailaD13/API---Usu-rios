# API de Usuários

API simples para gerenciamento de usuários usando Node.js, Express e Prisma com MongoDB.

# Instalar dependências
npm install

# Iniciar servidor
node server.js

# Gerar cliente prisma
npx prisma generate

# Rodar Prisma Studio 
npx prisma studio


# Rotas disponíveis 
GET /usuarios – Lista usuários

POST /usuarios – Cria um novo usuário

PUT /usuarios/:id – Atualiza um usuário

DELETE /usuarios/:id – Remove um usuário

