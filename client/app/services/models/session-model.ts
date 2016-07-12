export class Session {
  constructor(
    public id:string,
    public title: string,
    public date: Date,
    public speakers: string[],
    public event: string
  ) {  }
}