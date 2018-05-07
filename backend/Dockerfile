FROM mhart/alpine-node:10

LABEL maintainer="manuszep@gmail.com"

RUN npm install pm2 -g

WORKDIR /app

RUN npm install

EXPOSE 7070

RUN npm run dev

ENTRYPOINT [ "pm2-runtime", "dist/", "--watch" ]