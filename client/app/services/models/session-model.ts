export class Session {
  constructor(
    public id:string,
    public title: string,
    public startDate: Date,
    public endDate: Date,
    public speakers: string[],
    public status: string,
    public event: string
  ) {  }
}