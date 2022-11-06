FROM node:alpine

WORKDIR /matching-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8001
CMD [ "node", "./index.js" ]