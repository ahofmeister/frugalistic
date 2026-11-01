FROM supabase/gotrue:v2.170.0 AS gotrue

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile --prod

FROM deps AS build
COPY . .
ARG DATABASE_URL=postgres://build:build@localhost:5432/build
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=gotrue /usr/local/bin/auth /usr/local/bin/auth
COPY --from=gotrue /usr/local/etc/auth /usr/local/etc/auth
COPY --from=prod-deps /app/node_modules /opt/migrate/node_modules
COPY docker/migrate.mjs /opt/migrate/scripts/migrate.mjs
COPY drizzle/migrations /opt/migrate/drizzle/migrations
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY docker/start.mjs ./start.mjs
RUN mkdir /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 3000
CMD ["node", "start.mjs"]