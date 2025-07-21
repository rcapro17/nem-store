# NEM Store - E-commerce Next.js

Um e-commerce moderno construído com Next.js, integrado com WordPress/WooCommerce, PayPal e PostgreSQL.

## 🚀 Tecnologias

- **Frontend:** Next.js 13+, React, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Banco de Dados:** PostgreSQL
- **Pagamentos:** PayPal
- **CMS:** WordPress/WooCommerce
- **Containerização:** Docker & Docker Compose
- **Autenticação:** NextAuth.js

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

## 🛠️ Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/nem-store.git
cd nem-store
```

### 2. Configuração das Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# WordPress/WooCommerce
NEXT_PUBLIC_WORDPRESS_URL=https://seu-wordpress.com
WC_CONSUMER_KEY=ck_sua_chave_consumer
WC_CONSUMER_SECRET=cs_sua_chave_secret

# PayPal
PAYPAL_CLIENT_ID=seu_paypal_client_id
PAYPAL_CLIENT_SECRET=seu_paypal_client_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=seu_paypal_client_id_publico

# Autenticação
NEXTAUTH_SECRET=seu_nextauth_secret_muito_seguro
JWT_SECRET=seu_jwt_secret_muito_seguro

# Banco de Dados
DATABASE_URL=postgresql://nem_user:sua_senha@postgres:5432/nem_store_db
POSTGRES_PASSWORD=sua_senha_postgres_segura
```

## 🐳 Executando com Docker (Recomendado)

### Método Rápido

```bash
# Subir todos os serviços
docker-compose up --build

# Em segundo plano
docker-compose up -d --build
```

### Passo a Passo Detalhado

1. **Construir e iniciar os serviços:**

   ```bash
   docker-compose up --build
   ```

2. **Verificar se os serviços estão rodando:**

   ```bash
   docker-compose ps
   ```

3. **Acessar a aplicação:**

   - Frontend: http://localhost:3000
   - Banco de dados: localhost:5432

4. **Parar os serviços:**
   ```bash
   docker-compose down
   ```

### Comandos Úteis do Docker

```bash
# Ver logs da aplicação
docker-compose logs app

# Ver logs em tempo real
docker-compose logs -f app

# Executar comandos no container
docker exec -it nem-store-app sh

# Rebuild apenas um serviço
docker-compose up --build app

# Limpar volumes (CUIDADO: apaga dados do banco)
docker-compose down -v
```

## 💻 Desenvolvimento Local (Sem Docker)

### 1. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 2. Configurar Banco de Dados

Certifique-se de ter PostgreSQL rodando e configure a `DATABASE_URL` no `.env`.

### 3. Executar Migrations

```bash
npx prisma db push
npx prisma db seed
```

### 4. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse http://localhost:3000

## 🗄️ Banco de Dados

### Migrations com Prisma

```bash
# Aplicar mudanças no schema
npx prisma db push

# Gerar cliente Prisma
npx prisma generate

# Visualizar dados (Prisma Studio)
npx prisma studio

# Seed do banco
npx prisma db seed
```

### Backup e Restore

```bash
# Backup
docker exec nem-store-postgres pg_dump -U nem_user nem_store_db > backup.sql

# Restore
docker exec -i nem-store-postgres psql -U nem_user nem_store_db < backup.sql
```

## 🚀 Deploy

### Preparação para Produção

1. **Configurar variáveis de produção:**

   ```bash
   cp .env.example .env.production
   # Editar .env.production com valores de produção
   ```

2. **Build da aplicação:**

   ```bash
   npm run build
   ```

3. **Testar build localmente:**
   ```bash
   npm start
   ```

### Deploy com Docker

```bash
# Build para produção
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Linting do código

# Banco de dados
npm run db:push      # Aplicar schema
npm run db:seed      # Popular banco
npm run db:studio    # Interface visual
npm run db:reset     # Resetar banco (CUIDADO)

# Docker
npm run docker:up    # Subir containers
npm run docker:down  # Parar containers
npm run docker:logs  # Ver logs
```

## 📁 Estrutura do Projeto

```
├── components/          # Componentes React reutilizáveis
├── pages/              # Páginas Next.js e API routes
├── styles/             # Arquivos CSS e Tailwind
├── lib/                # Utilitários e configurações
├── context/            # Context API do React
├── prisma/             # Schema e migrations do banco
├── public/             # Assets estáticos
├── docker-compose.yml  # Configuração Docker
├── Dockerfile          # Build da aplicação
├── next.config.js      # Configuração Next.js
└── tailwind.config.js  # Configuração Tailwind
```

## 🔒 Segurança

### Variáveis de Ambiente

- **NUNCA** commite arquivos `.env*` (exceto `.env.example`)
- Use secrets seguros para produção
- Mantenha `.env.example` atualizado

### Configurações de Segurança

- Headers de segurança configurados no `next.config.js`
- CORS configurado para APIs
- Validação de entrada em todas as rotas

## 🐛 Troubleshooting

### Problemas Comuns

1. **Estilos não carregam no Docker:**

   ```bash
   # Verificar se .next/static existe
   docker exec -it nem-store-app ls -la .next/static
   ```

2. **Erro de conexão com banco:**

   ```bash
   # Verificar se PostgreSQL está rodando
   docker-compose logs postgres
   ```

3. **Erro de build:**
   ```bash
   # Limpar cache e rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

### Logs e Debug

```bash
# Logs detalhados
docker-compose logs -f app

# Entrar no container para debug
docker exec -it nem-store-app sh

# Verificar variáveis de ambiente
docker exec nem-store-app env
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/seu-usuario/nem-store/issues)
- **Documentação:** [Wiki do Projeto](https://github.com/seu-usuario/nem-store/wiki)

## 🙏 Agradecimentos

- Next.js Team
- Vercel
- Prisma Team
- Tailwind CSS Team
