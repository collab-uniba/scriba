FROM node:boron

# Create Scriba directory
RUN mkdir -p /usr/src/scriba
WORKDIR /usr/src/scriba

# Install app dependencies
COPY package.json /usr/src/scriba/
RUN npm install

# Bundle app source
COPY . /usr/src/scriba
COPY app /usr/src/scriba/
COPY app/models /usr/src/scriba/app/
COPY config /usr/src/scriba/

EXPOSE 8080
CMD [ "npm", "start" ]