FROM node

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8005
RUN npm run build

CMD [ "npm", "start"]