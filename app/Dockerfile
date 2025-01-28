FROM node:20-alpine

WORKDIR /app
COPY package.json ./
RUN npm install
COPY app.js app.js
COPY otel.js otel.js
CMD ["node", "app.js"]