# Backend Dockerfile
FROM node:18-alpine

# Créer un utilisateur non-privilégié
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --omit=dev && npm cache clean --force

# Copier le code source
COPY . .

# Changer la propriété des fichiers
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "app.js"]