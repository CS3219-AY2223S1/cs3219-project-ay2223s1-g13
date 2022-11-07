FROM node:alpine

WORKDIR /question-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8002
CMD [ "node", "./index.js" ]