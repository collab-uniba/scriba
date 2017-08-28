package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func main() {
	localProxyUrl, _ := url.Parse("http://ionicserver:8100/")
	localProxy := httputil.NewSingleHostReverseProxy(localProxyUrl)
	http.Handle("/", localProxy)

	log.Println("Serving on 0.0.0.0:9090")
	log.Fatal(http.ListenAndServeTLS(":9090", "server.crt", "server.key", nil))
}