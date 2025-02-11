FROM node:22-alpine

WORKDIR /app

# Copy only these first to leverage Docker cache
COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["npm", "start"]
