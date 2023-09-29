import { DataObject, IDataObject } from '../global/types';

export const createIdUser = (): number => {
  return new Date().getTime();
};

export const convertDataObjectToModel = <T>(dataObj: DataObject<T>): T => {
  const { id } = dataObj;

  return { id, ...dataObj.data } as T;
};

export const convertModelToDataObject = <T>(model: T): DataObject<T> => {
  const { id, ...data } = model as IDataObject<T>;

  return { id, data } as DataObject<T>;
};

/**
 * A function create token for user
 * @returns {string} Return token string
 */
export const createToken = (): string => {
  const lengthToken: number = 36;
  const chars: string =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token: string = '';
  for (let i: number = 0; i < lengthToken; i += 1) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};
