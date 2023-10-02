import { generateId } from 'helpers/data';

export default class Transaction {
  constructor(
    public id: string,
    public categoryName: string,
    public date: string,
    public note: string,
    public amount: number,
    public idUser: string,
  ) {
    this.id = id ? id : generateId();
    this.categoryName = categoryName;
    this.date = date;
    this.note = note;
    this.amount = amount;
    this.idUser = idUser;
  }
}
