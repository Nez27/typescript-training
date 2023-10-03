import { generateId } from '../helpers/data';

export default class User {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public accessToken?: string,
  ) {
    this.id = id ? id : generateId();
    this.email = email;
    this.password = password || '';
    this.accessToken = accessToken || '';
  }
}
