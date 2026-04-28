FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

# Railway sets PORT at runtime; EXPOSE is informational.
EXPOSE 3000

# Run Node directly so the process is not a child of npm (avoids npm SIGTERM noise on shutdown).
CMD ["node", "server.js"]
