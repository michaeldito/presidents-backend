# build
FROM nikolaik/python-nodejs:latest as api
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE 8080
ENV PORT=8080
CMD ["npm", "run", "start:babel"]
