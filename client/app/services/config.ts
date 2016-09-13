export class Configuration {
  constructor(
    public apiHost = 'http://scriba-deploy-pepponefx.c9users.io',
    public apiPORT = 8080,
    public apiPath = '/api'
  ) {  }//http://scriba-deploy-pepponefx.c9users.io:8080/api

  getApiUrl(){
      return this.apiHost+":"+this.apiPORT+""+this.apiPath;
  }
  getRoomUrl(){
      return this.apiHost;
  }
}