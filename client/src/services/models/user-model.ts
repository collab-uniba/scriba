
export class User {
  constructor(
    public name: string,
    public surname: string, 
    public username: string,
    public password: string,
    public email: string,
    public observedEvents? :string,
    public joinedEvents? :string
    ) {}
}