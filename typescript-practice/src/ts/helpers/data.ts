import { DataObject } from '../global/types';

export const createIdUser = (): number => {
  return new Date().getTime();
};

export const convertDataObjectToModel = <T>(dataObj: DataObject<T>): T => {
  const { id } = dataObj;

  return { id, ...dataObj.data } as T;
};

export const convertModelToDataObject = <T extends DataObject<T>>(
  model: T,
): T => {
  const { id, ...data } = model;

  return { id, data } as T;
};
