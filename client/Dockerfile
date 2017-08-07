FROM node:8

RUN npm install -g cordova@7.0.1
RUN npm install -g ionic@3.7.0
RUN npm install -g ionic-angular@3.6.0

# Create app directory
RUN mkdir -p /usr/src/scriba
WORKDIR /usr/src/scriba/

# Install app dependencies
COPY package.json /usr/src/scriba/
RUN npm install

# Bundle app source
COPY . /usr/src/scriba

WORKDIR /usr/src/scriba/

EXPOSE 8100
EXPOSE 35729

CMD ["ionic", "serve", "-b", "-d", "--address=0.0.0.0", "--no-interactive"]