import CommonView from './commonView';
import { ERROR_MESSAGE_DEFAULT } from '../constants/messages/dialog';
import {
  INVALID_EMAIL_FORMAT,
  PASSWORD_NOT_MATCH,
  PASSWORD_NOT_STRONG,
} from 'constants/messages/form';
import {
  compare2Password,
  isValidPassword,
  isValidateEmail,
  renderRequiredText,
} from '../helpers/validatorForm';

export default class AuthenticationView extends CommonView {
  public formEl: HTMLBodyElement | null;

  public emailEl: HTMLBodyElement | null;

  public messageDefault: string[];

  public inputPasswordEl: HTMLBodyElement | null;

  public inputPasswordConfirmEl: HTMLBodyElement | null;

  public listError: string[];

  constructor() {
    super();

    this.formEl = document.querySelector('.form');
    this.emailEl = document.querySelector("[name='email']");
    this.messageDefault = ERROR_MESSAGE_DEFAULT;
    this.inputPasswordEl = document.querySelector('input[name="password"]');
    this.inputPasswordConfirmEl = document.querySelector(
      'input[name="password_confirm"]',
    );

    this.listError = [];
  }

  // eslint-disable-next-line class-methods-use-this
  validateEmail(email: string): boolean {
    if (email) {
      if (!isValidateEmail(email)) {
        this.listError.push(INVALID_EMAIL_FORMAT);

        return false;
      }
      return true;
    }

    if (this.emailEl) renderRequiredText('email', this.emailEl);
    return false;
  }

  validatePassword(password: string): boolean {
    if (password) {
      if (!isValidPassword(password)) {
        this.listError.push(PASSWORD_NOT_STRONG);

        return false;
      }

      return true;
    }
    if (this.inputPasswordEl)
      renderRequiredText('password', this.inputPasswordEl);

    return false;
  }

  validatePasswordConfirm(password: string, passwordConfirm: string) {
    if (passwordConfirm) {
      if (!compare2Password(password, passwordConfirm)) {
        this.listError.push(PASSWORD_NOT_MATCH);

        return false;
      }

      return true;
    }

    if (this.inputPasswordConfirmEl)
      renderRequiredText('confirm password', this.inputPasswordConfirmEl);

    return false;
  }

  /**
   * Clear error message at form
   */
  clearErrorMessage() {
    // Reassign again to check error message element haved on page or not
    const errorMessageEl = document.querySelector('.form__error-message');
    const errorTextEl = document.querySelectorAll('.error-text');

    // If have error message on page, remove it with style error input password
    if (errorMessageEl || errorTextEl.length > 0) {
      if (errorMessageEl) errorMessageEl.remove();

      if (errorTextEl) {
        errorTextEl.forEach((item) => {
          item.remove();
        });
      }

      // Use for 2 form
      if (this.emailEl && this.inputPasswordEl) {
        this.emailEl.classList.remove('error-input');
        this.inputPasswordEl.classList.remove('error-input');
      }

      // Only register form required
      if (this.inputPasswordConfirmEl)
        this.inputPasswordConfirmEl.classList.remove('error-input');
    }
  }

  /**
   * Add event listener for input field at form
   */
  addHandlerInputFormChange(): void {
    if (this.formEl)
      this.formEl.addEventListener('input', () => {
        this.clearErrorMessage();
      });
  }

  /**
   * Show error message with error style input password.
   * @param {string} message The error message you want show in form.
   */
  showError(message: string[]): void {
    this.renderError(message);
  }

  /**
   * Show error message in form
   * @param {string} message The message will show in form
   */
  renderError(messages = this.messageDefault): void {
    if (messages.length > 0) {
      const messageItemMarkup = messages
        .map((message) => `<li>${message}</li>`)
        .join('\n');

      const markup = `
      <ul class="form__error-message">
        ${messageItemMarkup}
      </ul>
    `;

      const titleEl = document.querySelector('.form__title');

      if (titleEl) titleEl.insertAdjacentHTML('afterend', markup);
    }
  }
}
