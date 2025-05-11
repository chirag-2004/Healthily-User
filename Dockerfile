FROM node:18

WORKDIR /

COPY package*.json ./
RUN npm install

COPY src/ ./src/
COPY public/ ./public/
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
