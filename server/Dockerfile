FROM node:17-alpine
WORKDIR /app
RUN npm install express
RUN npm install cors
COPY . .
EXPOSE 8081
CMD [ "node", "server.js" ]