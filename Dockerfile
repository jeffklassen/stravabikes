FROM node:6.10

## Uncomment the following line if you want to expose ports
#EXPOSE 3000 

WORKDIR /app

ADD . /app

RUN npm install
RUN npm run webpack
CMD PORT=$PORT npm start 