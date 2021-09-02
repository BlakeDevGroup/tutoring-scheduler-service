FROM node:lts-alpine3.13

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache bash
RUN npm install

EXPOSE 3500
CMD ["npm", "run", "start"]