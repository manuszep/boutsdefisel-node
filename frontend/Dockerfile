FROM mhart/alpine-node:10

LABEL maintainer="manuszep@gmail.com"

RUN apk add --update nginx openrc

RUN mkdir -p /run/nginx

RUN rm -v /etc/nginx/nginx.conf

ADD nginx.conf /etc/nginx

WORKDIR /app

RUN npm install

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]