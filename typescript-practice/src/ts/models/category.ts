export default class Category {
  private readonly _id: number;

  private _url: string;

  private _name: string;

  constructor(id: number, url: string, name: string) {
    this._id = id;
    this._url = url;
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get url() {
    return this._url;
  }

  get name() {
    return this._name;
  }
}
