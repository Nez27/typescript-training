export default class Category {
  readonly id: string;

  url: string;

  name: string;

  constructor(id: string, url: string, name: string) {
    this.id = id;
    this.url = url;
    this.name = name;
  }
}
