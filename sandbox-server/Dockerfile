FROM node:24-alpine

# Dossier de travail
WORKDIR /app

# Installer les dépendances (cache optimisé)
COPY package*.json ./
RUN npm install

# Copier le code (sera écrasé par le volume en dev)
COPY . .

# Mode dev
ENV NODE_ENV=development

EXPOSE 3000

# Watch natif Node 20+
CMD ["node", "--watch", "src/server.js"]
