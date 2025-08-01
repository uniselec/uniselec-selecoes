# FROM node:20-alpine
FROM node:20
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
EXPOSE 5175
CMD ["yarn", "dev"]