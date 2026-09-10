FROM node:20-alpine

WORKDIR /app
COPY server/package.json ./
RUN npm install --omit=dev
COPY server/schema.sql server/db.js server/server.js ./
COPY public ./public

ENV PORT=8080
EXPOSE 8080
USER node
CMD ["node", "server.js"]
