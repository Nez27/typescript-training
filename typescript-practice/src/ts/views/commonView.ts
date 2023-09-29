import { MarkIcon, TypeToast } from '../constants/config';

export default class CommonView {
  public rootElement: HTMLBodyElement | null;

  public toastDialog: HTMLDialogElement | null;

  public toast: HTMLBodyElement | null;

  public toastIcon: HTMLBodyElement | null;

  public toastBtn: HTMLBodyElement | null;

  public toastTitle: HTMLBodyElement | null;

  public toastContent: HTMLBodyElement | null;

  public spinner: HTMLBodyElement | null;

  constructor() {
    this.rootElement = document.querySelector('body');
    this.toastDialog = document.querySelector('.dialog');
    this.toast = document.querySelector('.toast');

    this.toastIcon = this.toast ? this.toast.querySelector('.mark') : null;
    this.toastBtn = this.toast
      ? this.toast.querySelector('.toast__redirect-btn')
      : null;
    this.toastTitle = this.toast
      ? this.toast.querySelector('.toast__title')
      : null;
    this.toastContent = this.toast
      ? this.toast.querySelector('.toast__message')
      : null;

    this.spinner = null;

    // this.initToast();
    // this.initLoader();
    // this.handleEventToast();
  }

  /**
   * Implement toast in site
   */
  initToast(): void {
    const markup = `
      <dialog class="dialog">
        <div class="toast">
          <div class="mark"></div>
          <h2 class="toast__title"></h2>
          <p class="toast__message"></p>
          <button class="toast__redirect-btn">OK</button>
        </div>
      </dialog>
    `;

    if (this.rootElement)
      this.rootElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Show or hide loader screen
   */
  toggleLoaderSpinner(): void {
    if (this.spinner) this.spinner.classList.toggle('hidden');
  }

  /**
   * Add toast content
   * @param {TYPE_TOAST} typeToast Type of the toast
   * @param {string} title Title of toast
   * @param {string} content Content of toast
   * @param {string} btnContent Content of button
   */
  initToastContent(
    typeToast: string,
    title: string,
    content: string,
    btnContent: string,
  ): void {
    // Remove old typeToast class if haved
    Object.keys(TypeToast).forEach((key) => {
      CommonView.removeClassElement(TypeToast[key as TypeToast], this.toast);
    });

    // Remove old icon toast if haved
    Object.keys(MarkIcon).forEach((key) => {
      CommonView.removeClassElement(MarkIcon[key as MarkIcon], this.toastIcon);
    });

    // Init content toast
    if (
      this.toast &&
      this.toastIcon &&
      this.toastTitle &&
      this.toastContent &&
      this.toastBtn
    ) {
      this.toast.classList.add(
        typeToast === TypeToast.success ? TypeToast.success : TypeToast.error,
      );
      this.toastIcon.classList.add(
        typeToast === TypeToast.success ? MarkIcon.success : MarkIcon.error,
      );
      this.toastTitle.textContent = title;
      this.toastContent.textContent = content;
      this.toastBtn.textContent = btnContent;
    }
  }

  static removeClassElement(classEl: string, el: HTMLBodyElement | null): void {
    if (el && el.classList.contains(classEl)) {
      el.classList.remove(classEl);
    }
  }

  /**
   * Add event listener for toast
   */
  handleEventToast(): void {
    if (this.toastBtn) {
      this.toastBtn.addEventListener('click', () => {
        if (this.toastDialog) this.toastDialog.close();
      });
    }

    // Add event close dialog when click outside
    if (this.toastDialog) {
      this.toastDialog.addEventListener('click', (e) => {
        if (this.toastDialog) {
          const dialogDimensions = this.toastDialog.getBoundingClientRect();
          if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
          ) {
            this.toastDialog.close();
          }
        }
      });
    }
  }

  /**
   * Implement loader screen
   */
  initLoader() {
    const markup = `<div class="loader hidden"></div>`;

    if (this.rootElement)
      this.rootElement.insertAdjacentHTML('afterbegin', markup);

    // Init element
    this.spinner = document.querySelector('.loader');
  }
}
