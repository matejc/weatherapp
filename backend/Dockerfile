FROM node

WORKDIR /usr/local/app

COPY package.json .
COPY src src

RUN npm i

EXPOSE 9000

CMD npm start
