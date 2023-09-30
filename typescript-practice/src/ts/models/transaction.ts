import { generateId } from 'helpers/data';

export default class Transaction {
  private readonly _id: number;

  private _categoryName: string;

  private _date: string;

  private _note: string;

  private _amount: number;

  private _idUser: number;

  constructor(
    categoryName: string,
    date: string,
    note: string,
    amount: number,
    idUser: number,
  ) {
    this._id = generateId();
    this._categoryName = categoryName;
    this._date = date;
    this._note = note;
    this._amount = amount;
    this._idUser = idUser;
  }

  get id() {
    return this._id;
  }

  get categoryName() {
    return this._categoryName;
  }

  get date() {
    return this._date;
  }

  get note() {
    return this._note;
  }

  get amount() {
    return this._amount;
  }

  get idUser() {
    return this._idUser;
  }
}
