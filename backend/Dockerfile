FROM mhart/alpine-node:10

LABEL maintainer="manuszep@gmail.com"

RUN npm install pm2 -g

WORKDIR /app

RUN npm install

EXPOSE 7070

ENV DB=db
ENV DB_PORT=3306
ENV DOMAIN=backend

CMD [ "npm", "start" ]