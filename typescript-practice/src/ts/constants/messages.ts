export const VALIDATE_FORM = {
  INVALID_EMAIL_FORMAT: `The email is not correct!`,
  PASSWORD_NOT_MATCH: 'Password not match!',
  PASSWORD_NOT_STRONG:
    'Password must at least one uppercase, one lowercase letter, one number and one special character!',
  ERROR_CREDENTIAL: {
    title: 'Error Credential',
    message: 'Email or password not match! Please try again!',
  },
  REQUIRED_MESSAGE: (field: string) => `The ${field} is required!`,
};

export const TOAST = {
  ERROR_MESSAGE_DEFAULT: ['Something went wrong!'],
  TIME_OUT_ERROR: 'Connection time out! Please try again!',
  DEFAULT_TITLE_ERROR_TOAST: 'Error',
  USER_EXIST_ERROR: 'User is exists! Please try another email!',
  ADD_WALLET_SUCCESS: 'Add wallet success!',
  DEFAULT_MESSAGE: 'Press OK to continue!',
  ADD_TRANSACTION_SUCCESS: 'Add success!',
  UPDATE_TRANSACTION_SUCCESS: 'Update success!',
  REGISTER_SUCCESS: 'Register Success',
};
