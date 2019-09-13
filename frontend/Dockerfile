FROM node

WORKDIR /usr/local/app

COPY package.json .
COPY src src
COPY webpack.config.js .

RUN npm i

EXPOSE 8000

CMD npm start
