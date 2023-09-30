export const DATABASE_URL =
  'https://javascript-training-81f7a-default-rtdb.asia-southeast1.firebasedatabase.app';
export const TIME_OUT_SEC = 3;

export const BTN_CONTENT = {
  GOT_IT: 'Got it!',
  OK: 'Ok',
};

export const LOCAL_STORAGE = {
  ACCESS_TOKEN: 'accessToken',
};

export enum TypeToast {
  success = 'success',
  error = 'error',
}
export enum MarkIcon {
  success = 'success',
  error = 'error',
}

export const REGEX = {
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export const URL = {
  LOGIN: 'login',
  REGISTER: 'register',
  HOME: '',
};
