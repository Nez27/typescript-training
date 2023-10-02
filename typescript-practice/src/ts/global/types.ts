import Category from 'models/category';
import Transaction from 'models/transaction';
import User from 'models/user';
import Wallet from 'models/wallet';

export interface IDataObject<T> {
  id: string;
  data: T;
}

export class DataObject<T> {
  public id: string;

  public data: T;

  constructor(dataObject: IDataObject<T>) {
    this.id = dataObject?.id ?? null;
    this.data = <T>dataObject.data;
  }
}

export interface TError {
  title: string;
  message: string;
}

export class CustomError extends Error {
  constructor(
    public title: string,
    message?: string,
  ) {
    super(message);
  }
}

export type TSignal = {
  [key: string]: {
    name: string;
    handler: (value: Data) => void;
  };
};

export interface Data {
  wallet?: Wallet;
  listTransactions?: Transaction[];
  listCategories?: Category[];
  user?: User;
}

export interface ItemTransaction {
  id: string;
  day: string;
  fullDateString: string;
  note: string;
  amount: number;
}
