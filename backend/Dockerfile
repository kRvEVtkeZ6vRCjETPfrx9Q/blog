FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json frontend/tsconfig.json frontend/tsconfig.node.json frontend/vite.config.ts frontend/index.html frontend/
RUN npm --prefix frontend install
COPY frontend/src frontend/src
RUN npm --prefix frontend run build

FROM node:18-alpine AS backend-build
WORKDIR /app
COPY backend/package*.json backend/tsconfig.json backend/
RUN npm --prefix backend install
COPY backend/src backend/src
RUN npm --prefix backend run build

FROM node:18-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=frontend-build /app/frontend/dist ./dist/public
COPY backend/package.json .
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
