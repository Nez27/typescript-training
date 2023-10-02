import { generateId } from '../helpers/data';

export default class User {
  private readonly _id: number;

  private _email: string;

  private _password: string;

  private _accessToken: string;

  constructor(email: string, password: string, accessToken?: string) {
    this._id = generateId();
    this._email = email;
    this._password = password || '';
    this._accessToken = accessToken || '';
  }

  get password() {
    return this._password;
  }

  set accessToken(accessToken: string) {
    this._accessToken = accessToken;
  }

  get accessToken() {
    return this._accessToken;
  }

  get email() {
    return this._email;
  }

  get id() {
    return this._id;
  }

  get toObject() {
    return {
      id: this._id,
      email: this._email,
      password: this._password,
      accessToken: this.accessToken,
    } as User;
  }
}
