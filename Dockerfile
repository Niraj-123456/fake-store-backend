FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . /app

EXPOSE 8080

CMD [ "npm", "start" ]