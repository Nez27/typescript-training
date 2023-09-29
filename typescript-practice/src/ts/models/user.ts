import { createIdUser } from '../helpers/data';

export default class User {
  private id: number;

  private email: string;

  private password: string;

  private accessToken: string;

  constructor(email: string, password: string, accessToken: string) {
    this.id = createIdUser();
    this.email = email;
    this.password = password;
    this.accessToken = accessToken;
  }

  get getPassword() {
    return this.password;
  }

  set setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  get getAccessToken() {
    return this.accessToken;
  }
}
