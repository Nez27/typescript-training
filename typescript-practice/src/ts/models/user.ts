import { createIdUser } from '../helpers/helpers';

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
}
