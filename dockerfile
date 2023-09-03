FROM node:14.21.3

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY tsconfig.json tsconfig.json
COPY ./src ./src
COPY ./server ./server
COPY ./public ./public

RUN npm run build
RUN npm run build:server

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
