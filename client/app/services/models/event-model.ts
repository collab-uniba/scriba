export class Event {
  constructor(
    public id:string,
    public organizer: string,
    public title: string,
    public startDate: Date,
    public endDate: Date,
    public location: string,
    public status: string
  ) {  }
}