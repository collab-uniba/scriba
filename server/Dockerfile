FROM node:latest

# Create Scriba directory
RUN mkdir -p /usr/src/scriba
WORKDIR /usr/src/scriba

# Install app dependencies
COPY package.json /usr/src/scriba/
RUN npm install

# Bundle app source
COPY . /usr/src/scriba

EXPOSE 9091
EXPOSE 9092

CMD [ "npm", "start" ]