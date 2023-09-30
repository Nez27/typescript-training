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
    this.data = dataObject.data as T;
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
  wallet: Wallet;
}
