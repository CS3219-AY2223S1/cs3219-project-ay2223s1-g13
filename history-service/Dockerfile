FROM node:alpine

WORKDIR /history-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8005
CMD [ "node", "./index.js" ]