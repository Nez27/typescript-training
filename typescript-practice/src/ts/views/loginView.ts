import AuthenticationView from './authenticationView';
import { TypeToast, BTN_CONTENT } from '../constants/config';
import User from 'models/user';
import { DEFAULT_TITLE_ERROR_TOAST } from 'constants/messages/dialog';
import { CustomError, TError } from 'global/types';
import { redirectToLoginPage } from 'helpers/url';
import { ERROR_CREDENTIAL } from 'constants/messages/form';

export default class LoginView extends AuthenticationView {
  constructor() {
    super();

    this.initToast();
    this.initLoader();
    this.handleEventToast();
  }

  async loadPage(getInfoUserLogin: () => Promise<User | null>) {
    this.toggleLoaderSpinner();
    const user = await getInfoUserLogin();
    if (user) {
      window.location.replace('/');
    }
    this.toggleLoaderSpinner();
  }

  /**
   * Implement error toast in site
   * @param {string} content The content will show in error toast
   */
  initErrorToast(error: TError | string): void {
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
   * @param {Function} validateUser The function need to be set event
   */
  addHandlerForm(
    loginUser: (email: string, password: string) => Promise<boolean>,
  ) {
    if (this.formEl)
      this.formEl.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        this.clearErrorMessage();
        this.submitForm(loginUser, e);
      });
  }

  /**
   * The action when submit form
   * @param {Function} loginUser The function need to be set event
   * * @param {event} event The event target
   */
  async submitForm(
    loginUser: (email: string, password: string) => Promise<boolean>,
    event: Event,
  ) {
    try {
      // Load spinner
      this.toggleLoaderSpinner();
      // Get data from form
      const userInput = this.validateForm(event);
      if (userInput) {
        // Check user exist
        const results = await loginUser(userInput.email, userInput.password);
        if (results) {
          window.location.replace('/');
          return;
        }
        throw new CustomError(ERROR_CREDENTIAL.title, ERROR_CREDENTIAL.message);
      }
    } catch (error) {
      // Show toast error
      this.initErrorToast(error as string | TError);
    }
    // Close spinner
    this.toggleLoaderSpinner();
  }

  /**
   * Get data from user input
   * @returns {Object || null} Return object or null
   */
  validateForm(event: Event): User | null {
    if (event.target) {
      const formData = new FormData(event.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // Validate user input
      this.listError = []; // Reset list error
      const emailValid = this.validateEmail(email);
      const passwordValid = this.validatePassword(password);

      // Show error style
      if (this.emailEl && this.inputPasswordEl) {
        this.emailEl.classList.toggle('error-input', !emailValid);
        this.inputPasswordEl.classList.toggle('error-input', !passwordValid);
        if (emailValid && passwordValid) {
          return new User(email, password);
        }
      }
    }

    this.showError(this.listError);
    return null;
  }
}
