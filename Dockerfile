# Dockerfile

FROM node:14.17.1

WORKDIR /app

COPY . ./

RUN npm install serve -g --silent
RUN npm install --silent

ENV PATH /app/node_modules/.bin:$PATH

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]