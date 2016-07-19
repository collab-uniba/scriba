export class Intervent {
  constructor(
    public id:string,
    public title: string,
    public date: Date,
    public duration: number,
    public speaker: string,
    public session: string,
    public status: string
  ) {  }
}