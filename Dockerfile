FROM node:18.12.0-alpine3.16
# RUN apk add --no-cache python3 \
#     jpeg-dev \
#     cairo-dev \
#     giflib-dev \
#     pango-dev \
#     make \
#     g++ \
#     ttf-opensans \
#     ttf-dejavu \
#     ttf-droid \
#     ttf-freefont \
#     ttf-liberation \
#     fontconfig
RUN mkdir -p /home/node/app/node_modules && chown -R root:root /home/node/app
WORKDIR /home/node/app
COPY package*.json ./

USER root
RUN npm install
COPY --chown=root:root . .

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
    echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
    apk add doppler

EXPOSE 3000

CMD [ "doppler", "run", "--", "node", "app.js" ]
