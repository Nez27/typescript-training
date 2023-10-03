import { TypeToast, BTN_CONTENT } from '../constants/config';
import AuthenticationView from './authenticationView';
import User from '../models/user';
import { redirectToLoginPage } from '../helpers/url';
import {
  DEFAULT_MESSAGE,
  DEFAULT_TITLE_ERROR_TOAST,
  REGISTER_SUCCESS,
  USER_EXIST_ERROR,
} from 'constants/messages';
import { Nullable, PromiseOrNull, TError } from 'global/types';

interface UserInput {
  email: string;
  password: string;
  passwordConfirm: string;
}

export default class RegisterView extends AuthenticationView {
  constructor() {
    super();

    this.initToast();
    this.initLoader();
    this.handleEventToast();

    this.toastBtn = document.querySelector('.toast__redirect-btn');
  }

  async loadPage(getInfoUserLogin: PromiseOrNull<User>) {
    this.toggleLoaderSpinner();

    const user = await getInfoUserLogin();

    if (user) {
      window.location.replace('/');
    }

    this.toggleLoaderSpinner();
  }

  /**
   * Get data from user input
   * @returns {Object || null} Return object or null
   */
  getUserFromForm(): Nullable<User> {
    const form = document.getElementById('registerForm') as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('password_confirm') as string;

    const userInput: UserInput = {
      email,
      password,
      passwordConfirm,
    };

    const result = this.validateForm(userInput);

    if (result) {
      return new User('', email, password);
    }

    return null;
  }

  validateForm(userInput: UserInput): boolean {
    // Validate user input
    this.listError = []; // Reset list error
    const emailValid = this.validateEmail(userInput.email);
    const passwordValid = this.validatePassword(userInput.password);
    const passwordConfirmValid = this.validatePasswordConfirm(
      userInput.password,
      userInput.passwordConfirm,
    );

    // Show error style
    if (this.emailEl && this.inputPasswordEl && this.inputPasswordConfirmEl) {
      this.emailEl.classList.toggle('error-input', !emailValid);
      this.inputPasswordEl.classList.toggle('error-input', !passwordValid);
      this.inputPasswordConfirmEl.classList.toggle(
        'error-input',
        !passwordConfirmValid,
      );
    }

    this.showError(this.listError);

    return emailValid && passwordValid && passwordConfirmValid;
  }

  /**
   * Implement register success toast in site
   */
  showRegisterSuccessToast() {
    const typeToast = TypeToast.success;
    const title = REGISTER_SUCCESS;
    const content = DEFAULT_MESSAGE;
    const btnContent = BTN_CONTENT.OK;

    this.initToastContent(typeToast, title, content, btnContent);

    // Show toast
    if (this.toastDialog) this.toastDialog.showModal();

    // Add event for toast button
    if (this.toastBtn)
      this.toastBtn.addEventListener('click', redirectToLoginPage);
  }

  /**
   * Implement error toast in site
   * @param {string} content The content will show in error toast
   */
  initErrorToast(error: TError) {
    const title =
      typeof error === 'object' && error.title
        ? error.title
        : DEFAULT_TITLE_ERROR_TOAST;

    const content =
      typeof error === 'object' && error.message
        ? error.message
        : (error as string);

    this.initToastContent(TypeToast.error, title, content, BTN_CONTENT.OK);

    if (this.toastDialog && this.toastBtn) {
      // Show toast
      this.toastDialog.showModal();

      // Remove event for toast button
      this.toastBtn.removeEventListener('click', redirectToLoginPage);
    }
  }

  /**
   * Add event listener for form input
   * @param {Function} handler The function need to be set event
   */
  addHandlerForm(
    checkExistUser: (email: string) => Promise<boolean>,
    saveUser: (user: User) => Promise<void>,
  ) {
    if (this.formEl) {
      this.formEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        this.clearErrorMessage();
        await this.submitForm(checkExistUser, saveUser);
      });
    }
  }

  async submitForm(
    checkExistUser: (email: string) => Promise<boolean>,
    saveUser: (user: User) => Promise<void>,
  ): Promise<void> {
    try {
      // Load spinner
      this.toggleLoaderSpinner();

      // Get validate form
      const user = this.getUserFromForm();

      // Save user
      if (user) {
        // Check user exist
        const userExist = await checkExistUser(user.email);
        if (userExist) {
          throw Error(USER_EXIST_ERROR);
        } else {
          await saveUser(user);
          // Show toast success
          this.showRegisterSuccessToast();

          // Clear form
          const formEl = document.getElementById(
            'registerForm',
          ) as HTMLFormElement;

          if (formEl) formEl.reset();
        }
      }
    } catch (error) {
      // Show toast error
      this.initErrorToast(error as TError);
    }

    // Close spinner
    this.toggleLoaderSpinner();
  }
}
