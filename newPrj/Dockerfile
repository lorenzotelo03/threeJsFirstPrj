FROM php:8-apache

#RUN apt-get update && docker-php-ext-install pdo pdo_mysql mysqli
RUN docker-php-ext-install pdo pdo_mysql
COPY . /var/www/html/
EXPOSE 9000