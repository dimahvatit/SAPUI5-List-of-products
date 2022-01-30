FROM node:17-alpine
WORKDIR /app
RUN npm install cors-anywhere
COPY . .
EXPOSE 8081
CMD [ "node", "proxy.js" ]