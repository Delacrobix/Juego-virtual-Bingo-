FROM node:16-alpine

WORKDIR /front/nodejs

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 8081

ENTRYPOINT [ "npm", "run", "docker:dev" ]