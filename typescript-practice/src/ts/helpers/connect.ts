import { TOAST } from '../constants/messages';
import { TIME_OUT_SEC } from '../constants/config';
import FirebaseService from '../services/firebaseService';

/**
 * A waiting function with s second
 * @param {number} s The time will be waiting
 * @returns {Promise} A Promise will be only reject after s second
 */
export const timeout = (s: number): Promise<string> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      FirebaseService.disconnect();
      reject(TOAST.TIME_OUT_ERROR);
    }, s * 1000);
  });
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
