import { generateId } from '../helpers/data';

export default class User {
  id: string;

  email: string;

  password: string;

  accessToken: string;

  constructor(email: string, password: string, accessToken?: string) {
    this.id = generateId();
    this.email = email;
    this.password = password || '';
    this.accessToken = accessToken || '';
  }
}
