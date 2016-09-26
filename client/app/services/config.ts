export class Configuration {
  constructor(
    public apiHost = 'http://localhost',
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