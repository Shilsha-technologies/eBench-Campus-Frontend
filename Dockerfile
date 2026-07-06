FROM node:20

WORKDIR /app

COPY package*.json ./

RUN echo "=== PACKAGE.JSON ==="
RUN cat package.json

RUN npm cache clean --force
RUN npm install

COPY . .

RUN echo "=== AFTER COPY ==="
RUN ls -l package.json

EXPOSE 5173

CMD ["npm", "run", "dev"]