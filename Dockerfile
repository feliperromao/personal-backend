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

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:dev"]