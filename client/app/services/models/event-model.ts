export class Event {
  constructor(
    public id:string,
    public organizer: string,
    public title: string,
    public date: Date,
    public location: string
  ) {  }
}