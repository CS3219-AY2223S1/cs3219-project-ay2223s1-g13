FROM node:alpine

WORKDIR /user-service
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD [ "node", "./index.js" ]