# Use a imagem oficial do Node.js como base
FROM node:20 as develop

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o código da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta que a aplicação vai usar
EXPOSE 3020

# build da aplicação
RUN npm run build

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:dev"]

FROM node:20-alpine3.20 AS production

WORKDIR /usr/src/app

COPY --from=develop /usr/src/app/package.json ./
COPY --from=develop /usr/src/app/package-lock.json ./
COPY --from=develop /usr/src/app/dist ./dist
COPY --from=develop /usr/src/app/node_modules ./node_modules

RUN npm ci --only=production

ENV NODE_ENV=production

EXPOSE 3020

CMD ["node", "dist/main"]