## ===========================================================> The common stage
FROM node:20.12-alpine AS base
ENV NODE_ENV=production

RUN npm install -g npm@10.7.0

WORKDIR /app

COPY package*.json ./
RUN npm install --force --legacy-peer-deps

## Remove unnecessary files from `node_modules` directory
# RUN ( wget -q -O /dev/stdout https://gobinaries.com/tj/node-prune | sh ) \
#  && node-prune


## ======================================================> The build image stage
FROM base AS build
ENV NODE_ENV=development

RUN npm install -g npm@10.7.0

COPY . .

RUN npm install --force --legacy-peer-deps 

## Compile the TypeScript source code
# RUN npm run build


## =================================================> The production image stage
FROM node:20.12-alpine AS prod
ENV NODE_ENV=production

RUN npm install -g npm@10.7.0

ARG PORT=8000
ENV APP_PORT=$PORT
EXPOSE $PORT

HEALTHCHECK --interval=10m --timeout=5s --retries=3 \
        CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

WORKDIR /app
## Copy required file to run the production application
COPY --from=base --chown=node:node /app/node_modules ./node_modules
COPY --from=base --chown=node:node /app/*.json ./
COPY --from=build --chown=node:node /app/dist ./dist/

## https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html
RUN apk add --no-cache dumb-init

## Dropping privileges
USER node
## Running the app wrapped by the init system for helping on graceful shutdowns
CMD ["dumb-init", "npm","run", "start:prod"]