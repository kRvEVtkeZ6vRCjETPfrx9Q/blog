FROM node:18-alpine
WORKDIR /app
COPY package*.json tsconfig.json tsconfig.node.json vite.config.ts index.html ./
RUN npm install
COPY src ./src
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]
