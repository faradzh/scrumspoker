FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY landing/package*.json landing/
RUN npm install --prefix landing

COPY client/package*.json client/
RUN npm install --prefix client

COPY server/package*.json server/
RUN npm install --prefix server

COPY landing/ landing/
RUN npm run build --prefix landing

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/
RUN npm run build --prefix server || echo "No build step for server"

# Set permissions for non-root user
RUN chown -R node:node /app
USER node

CMD ["npm", "start", "--prefix", "server"]

EXPOSE 443