# --- Stage 1: Build Next.js ---
FROM node:20-alpine AS builder

WORKDIR /app

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

COPY package.json yarn.lock* pnpm-lock.yaml* ./

RUN rm -rf node_modules && \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile --force; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile --force; \
  else npm install --immutable --force; \
  fi

# Copiar todos os arquivos necessários para build
COPY pages ./pages
COPY components ./components
COPY public ./public
COPY styles ./styles
COPY prisma ./prisma
COPY lib ./lib
COPY context ./context
COPY next.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

RUN chown -R nextjs:nodejs /app && chmod -R 755 /app

USER nextjs

RUN npx prisma generate

# Build args para variáveis de ambiente
ARG NEXT_PUBLIC_WORDPRESS_URL
ARG WC_CONSUMER_KEY
ARG WC_CONSUMER_SECRET
ARG PAYPAL_CLIENT_ID
ARG PAYPAL_CLIENT_SECRET
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXTAUTH_SECRET
ARG JWT_SECRET
ARG DATABASE_URL

ENV NEXT_PUBLIC_WORDPRESS_URL=${NEXT_PUBLIC_WORDPRESS_URL}
ENV WC_CONSUMER_KEY=${WC_CONSUMER_KEY}
ENV WC_CONSUMER_SECRET=${WC_CONSUMER_SECRET}
ENV PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
ENV PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET}
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=${NEXT_PUBLIC_PAYPAL_CLIENT_ID}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV JWT_SECRET=${JWT_SECRET}
ENV DATABASE_URL=${DATABASE_URL}
ENV DOCKER_ENV=true
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Debug - Verificar se os assets foram gerados
RUN echo "=== Verificando estrutura do build ===" && \
    ls -la /app/.next && \
    echo "=== Verificando .next/static ===" && \
    ls -la /app/.next/static && \
    echo "=== Verificando .next/standalone ===" && \
    ls -la /app/.next/standalone

# --- Stage 2: Run app ---
FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

# CORREÇÃO PRINCIPAL: Copiar tanto standalone quanto static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Opcional: manter styles se houver CSS customizado
COPY --from=builder --chown=nextjs:nodejs /app/styles ./styles

# Garantir permissões corretas
RUN chmod -R 755 ./.next ./public ./styles

USER nextjs

EXPOSE 3000

# Verificar estrutura final antes de iniciar
RUN echo "=== Estrutura final do container ===" && \
    ls -la /app && \
    echo "=== Verificando .next/static no runtime ===" && \
    ls -la /app/.next/static

CMD ["node", "server.js"]

