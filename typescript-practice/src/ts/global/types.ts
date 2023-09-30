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

export type TError = {
  title: string;
  message: string;
};

export class CustomError extends Error {
  constructor(
    public title: string,
    message?: string,
  ) {
    super(message);
  }
}
