FROM node:8.14.0-alpine

EXPOSE 7000 6379

WORKDIR usr/src/app 

COPY package*.json ./

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install nodemon -g \
    && npm install \
    && npm cache clean --force \
    && apk del .gyp

COPY ./ ./

CMD ["nodemon", "./bin/www"]