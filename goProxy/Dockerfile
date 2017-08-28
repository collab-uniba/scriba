FROM golang

RUN apt-get update
RUN apt-get install openssl

#RUN curl -O https://storage.googleapis.com/golang/go1.6.linux-amd64.tar.gz
#RUN sha256sum go1.6.linux-amd64.tar.gz
#RUN tar xvf go1.6.linux-amd64.tar.gz

# RUN openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
# RUN openssl rsa -passin pass:x -in server.pass.key -out server.key
# RUN rm server.pass.key
# RUN openssl req -new -key server.key -out server.csr
# RUN openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# start the proxy
# RUN go run httpsproxy.go

EXPOSE 9090