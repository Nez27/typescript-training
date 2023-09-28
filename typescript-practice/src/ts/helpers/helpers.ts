import * as MESSAGE from '../constants/message';
import { TIME_OUT_SEC, REGEX } from '../constants/config';
import FirebaseService from '../services/firebaseService';
import { DataObject } from '../global/types';

/**
 * Validate password
 * @param {string} password Password input
 * @returns {boolean} Return true if validate password success, otherwise return false
 */
export const isValidPassword = (password: string): boolean => {
  return REGEX.PASSWORD.test(password);
};

export const isValidateEmail = (email: string): RegExpMatchArray | null => {
  return String(email).toLowerCase().match(REGEX.EMAIL);
};

export const compare2Password = (
  password: string,
  passwordConfirm: string,
): boolean => {
  return password === passwordConfirm;
};

/**
 * A waiting function with s second
 * @param {number} s The time will be waiting
 * @returns {Promise} A Promise will be only reject after s second
 */
export const timeout = (s: number): Promise<string> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      FirebaseService.disconnect();
      reject(MESSAGE.TIME_OUT_ERROR);
    }, s * 1000);
  });
};

export const createIdUser = (): number => {
  return new Date().getTime();
};

/**
 * A function waiting the action need to be perform and throw error after s second.
 * @param {Function} action The action need to be perform.
 * @returns { Object || Error } Return the any object from Firebase or Error
 */
export const timeOutConnect = async <T>(
  action: Promise<T>,
): Promise<string | T> => {
  const result: T | string = await Promise.race([
    action,
    timeout(TIME_OUT_SEC),
  ]);

  return result;
};

export const renderRequiredText = (field: string, element: Element): void => {
  const markup: string = `
    <p class="error-text">${MESSAGE.REQUIRED_MESSAGE(field)}</p>
  `;

  element.insertAdjacentHTML('afterend', markup);
};

export const redirectToLoginPage = (): void => {
  window.location.replace('/login');
};

export const convertDataObjectToModel = (dataObj: {
  id: string;
  data: object;
}): DataObject => {
  const { id } = dataObj;

  return { id, ...dataObj.data } as DataObject;
};

export const convertModelToDataObject = <T extends DataObject>(model: T): T => {
  const { id, ...data } = model;

  return { id, data } as T;
};
