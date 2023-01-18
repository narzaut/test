FROM node:18.11.0-alpine
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4123
CMD ["npm", "run", "start"]
