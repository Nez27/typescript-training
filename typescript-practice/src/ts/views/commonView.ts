import { MarkIcon, TypeToast } from '../constants/config';

export default class CommonView {
  public toastDialog: HTMLDialogElement | null = null;

  public toastIcon: HTMLBodyElement | null = null;

  public toastBtn: HTMLBodyElement | null = null;

  public toastTitle: HTMLBodyElement | null = null;

  public toastContent: HTMLBodyElement | null = null;

  public spinner: HTMLBodyElement | null = null;

  constructor() {
    this.toastDialog = document.querySelector('.dialog .toast');

    this.spinner = null;
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

    const body = document.querySelector('body');

    if (body) body.insertAdjacentHTML('afterbegin', markup);

    this.initToastEl();
  }

  initToastEl() {
    this.toastDialog = document.querySelector('.dialog');

    this.toastIcon = this.toastDialog
      ? this.toastDialog.querySelector('.mark')
      : null;
    this.toastBtn = this.toastDialog
      ? this.toastDialog.querySelector('.toast__redirect-btn')
      : null;
    this.toastTitle = this.toastDialog
      ? this.toastDialog.querySelector('.toast__title')
      : null;
    this.toastContent = this.toastDialog
      ? this.toastDialog.querySelector('.toast__message')
      : null;
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
      CommonView.removeClassElement(
        TypeToast[key as TypeToast],
        this.toastDialog as HTMLBodyElement | null,
      );
    });

    // Remove old icon toast if haved
    Object.keys(MarkIcon).forEach((key) => {
      CommonView.removeClassElement(MarkIcon[key as MarkIcon], this.toastIcon);
    });

    // Init content toast
    if (
      this.toastDialog &&
      this.toastIcon &&
      this.toastTitle &&
      this.toastContent &&
      this.toastBtn
    ) {
      this.toastDialog.classList.add(
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

    const body = document.querySelector('body');
    if (body) body.insertAdjacentHTML('afterbegin', markup);

    // Init element
    this.spinner = document.querySelector('.loader');
  }
}
