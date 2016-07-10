export class Event {
  constructor(
    public creator: string,
    public title: string,
    public date: Date,
    public location: string
  ) {  }
}