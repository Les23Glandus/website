# syntax=docker/dockerfile:1

# --- Stage 1 : dépendances -------------------------------------------------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Stage 2 : build --------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables NEXT_PUBLIC_* : inlinées dans le bundle JS au moment du build,
# donc doivent être fournies en --build-arg (docker-compose s'en charge via
# la section build.args, lue depuis le fichier .env du projet).
ARG NEXT_PUBLIC_STRAPI_MEDIA_URL
ARG NEXT_PUBLIC_SITE_ORIGIN
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY
ARG NEXT_PUBLIC_GA4_ID
ARG NEXT_PUBLIC_FB_APP_ID
ENV NEXT_PUBLIC_STRAPI_MEDIA_URL=$NEXT_PUBLIC_STRAPI_MEDIA_URL \
    NEXT_PUBLIC_SITE_ORIGIN=$NEXT_PUBLIC_SITE_ORIGIN \
    NEXT_PUBLIC_GOOGLE_MAPS_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_KEY \
    NEXT_PUBLIC_GA4_ID=$NEXT_PUBLIC_GA4_ID \
    NEXT_PUBLIC_FB_APP_ID=$NEXT_PUBLIC_FB_APP_ID

# Variables serveur (Strapi) : pas indispensables pour next build en soi,
# mais nécessaires si des pages sont pré-rendues statiquement au build
# (generateStaticParams / fetch sans revalidate). Sans effet sinon.
ARG STRAPI_URL
ARG STRAPI_API_TOKEN
ENV STRAPI_URL=$STRAPI_URL \
    STRAPI_API_TOKEN=$STRAPI_API_TOKEN

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Stage 3 : image de production -----------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
