FROM node:current-alpine

RUN apk update
RUN apk add --no-cache chromium

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN mkdir /md-pdf

WORKDIR /md-pdf

COPY package.json package.json
COPY config.json config.json
COPY server.js server.js
COPY res res
COPY views views

RUN npm i

CMD npm start