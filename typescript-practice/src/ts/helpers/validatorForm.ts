import { REGEX } from '../constants/config';
import { VALIDATE_FORM } from '../constants/messages';

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

export const renderRequiredText = (field: string, element: Element) => {
  const markup: string = `
    <p class="error-text">${VALIDATE_FORM.REQUIRED_MESSAGE(field)}</p>
  `;

  element.insertAdjacentHTML('afterend', markup);
};
