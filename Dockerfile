# Stage 1: Build dell'applicazione React con Vite
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Compila l'applicazione in dist/
RUN npm run build

# Stage 2: Esecuzione dell'applicazione
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia i file compilati generati dallo stage di build
COPY --from=builder /app/dist ./dist

EXPOSE 5173

# Avvia il server di preview integrato di Vite sulla porta 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
