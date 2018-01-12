FROM nginx:1.11.3
MAINTAINER William Wagner <wcw.wagner@gmail.com>
RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/
RUN rm /etc/nginx/conf.d/default.conf
COPY app.conf /etc/nginx/conf.d/
