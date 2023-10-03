export default class Category {
  constructor(
    public id: string,
    public url: string,
    public name: string,
  ) {
    this.id = id;
    this.url = url;
    this.name = name;
  }
}
