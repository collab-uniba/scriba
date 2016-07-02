
export class User {

  public name: string;
  public surname: string;
  public username: string;
  public password: string;
  public email: string;

  constructor(name, surname, username, password, email) {
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.password = password;
    this.email = email;
  }

}