FROM node:22-alpine

COPY package.json yarn.lock /app/

WORKDIR /app

RUN npm install

COPY docs /app/docs/
COPY src /app/application/

RUN npm install

CMD [ "yarn", "start:dev" ]