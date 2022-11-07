FROM node:alpine

WORKDIR /collaboration-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8003
CMD [ "node", "./index.js" ]