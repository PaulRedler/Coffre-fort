# FROM node:18-alpine
FROM node:22-alpine

WORKDIR /app

# Copier package.json et package-lock.json depuis le parent
COPY ../package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npx", "vite", "--host", "0.0.0.0"]
