import { BTN_CONTENT, TypeToast } from '../../constants/config';
import CommonView from '../commonView';
import { clearAccessToken, formatNumber } from '../../helpers/data';

import WalletView from './walletView';
import Wallet from 'models/wallet';
import Transform from 'helpers/transform';
import Transaction from 'models/transaction';
import User from 'models/user';
import { Data, TError } from 'global/types';
import { DEFAULT_TITLE_ERROR_TOAST } from 'constants/messages/dialog';
import { redirectToLoginPage } from 'helpers/url';

export default class HomeView extends CommonView {
  private _tabs: NodeListOf<Element>;

  private _allContent: NodeListOf<Element>;

  private _cancelBtns: NodeListOf<Element>;

  private _dialogs: NodeListOf<Element>;

  private _amountInputs: NodeListOf<Element>;

  private _walletView: WalletView;

  private _user: User | null = null;

  private _wallet: Wallet | null = null;

  private _getInfoUserLogin: (() => Promise<User | null>) | null = null;

  private _getWalletByIdUser:
    | ((idUser: number) => Promise<Wallet | null>)
    | null = null;

  private _saveWallet: ((wallet: Wallet) => Promise<void>) | null = null;

  private _saveTransaction:
    | ((transaction: Transaction) => Promise<void>)
    | null = null;

  private _transform: Transform | null = null;

  constructor() {
    super();

    this._tabs = document.querySelectorAll('.app__tab-item');
    this._allContent = document.querySelectorAll('.app__content-item');
    this._cancelBtns = document.querySelectorAll('.form__cancel-btn');
    this._dialogs = document.querySelectorAll('.dialog');

    this._amountInputs = document.querySelectorAll('.form__input-balance');

    this._walletView = new WalletView();
  }

  initFunction(
    getInfoUserLogin: () => Promise<User | null>,
    getWalletByIdUser: (idUser: number) => Promise<Wallet | null>,
    saveWallet: (wallet: Wallet) => Promise<void>,
    saveTransaction: (transaction: Transaction) => Promise<void>,
    transform: Transform,
  ) {
    this._getInfoUserLogin = getInfoUserLogin;
    this._getWalletByIdUser = getWalletByIdUser;
    this._saveWallet = saveWallet;
    this._saveTransaction = saveTransaction;

    this._transform = transform;

    // Init function for child view
    this.initWalletViewFunction();
  }

  initWalletViewFunction() {
    this._walletView.initFunction(
      this._transform,
      this.toggleLoaderSpinner.bind(this),
      this._saveWallet,
      this._saveTransaction,
      this.loadData.bind(this),
      this.loadEvent.bind(this),
      this.showSuccessToast.bind(this),
      this.showErrorToast.bind(this),
    );
  }

  subscribeListenerData() {
    this.subscribe();
    this._walletView.subscribe();
  }

  async loadData() {
    // Send data to other class
    this.sendData();

    await this.loadWalletUser();
  }

  async loadPage() {
    this.toggleLoaderSpinner();
    const user = await this._getInfoUserLogin!();

    if (!user) {
      // If user not login yet
      clearAccessToken();
      window.location.replace('/login');
    } else {
      // If user already login
      this._user = user;
      this._wallet = await this._getWalletByIdUser!(user.id);

      this.sendData();
      // Check user's wallet if have or not
      if (!this._wallet) {
        // Show add wallet dialog
        this._walletView.showDialog();
      } else {
        // Init data
        await this.loadData();

        // Load event page
        this.loadEvent();
      }
    }

    this.toggleLoaderSpinner();
  }

  // ---------------------LOAD DATA---------------------//

  subscribe() {
    this._transform!.create('homeView', this.updateData.bind(this));
  }

  sendData() {
    const data: Data = {
      wallet: this._wallet!,
      user: this._user!,
    };

    this._transform!.onSendSignal('homeView', data);
  }

  updateData(data: Data) {
    if (data.wallet) this._wallet = data.wallet;

    if (data.user) this._user = data.user;
  }

  /**
   * Load wallet user
   */
  async loadWalletUser() {
    const wallet = this._wallet
      ? this._wallet
      : await this._getWalletByIdUser!(this._user!.id);
    const walletName = document.querySelector('.wallet__name');
    const walletPrice = document.querySelector('.wallet__price');
    const walletNameValue = wallet!.walletName;
    const walletAmountValue = wallet!.amountWallet;

    const sign = walletAmountValue >= 0 ? '+' : '-';

    this._wallet = wallet; // Make wallet into global variable

    walletName!.textContent = walletNameValue;
    walletPrice!.textContent = `${sign}$ ${formatNumber(
      Math.abs(walletAmountValue),
    )}`; // Math.abs(walletAmountValue) to keep the value always > 0

    // Update amount wallet into database
    this._saveWallet!(this._wallet!);
  }

  // ---------------------END---------------------//

  showSuccessToast(title: string, message: string) {
    const typeToast = TypeToast.success;
    const btnContent = BTN_CONTENT.OK;

    this.initToastContent(typeToast, title, message, btnContent);

    this.toastDialog!.showModal();
  }

  /**
   * Implement error toast in site
   * @param {string} content The content will show in error toast
   */
  showErrorToast(error: TError | string): void {
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

  // ------------------------------- HANDLER EVENT ------------------------------- //

  loadEvent() {
    this.addCommonEventPage();
    this.handlerTabsTransfer();
  }

  /**
   * Handle event when click on tabs
   */
  handlerTabsTransfer() {
    this._tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e: Event) => {
        this.removeActiveTab();
        tab.classList.add('active');

        const line = document.querySelector<HTMLElement>(
          '.app__line',
        ) as HTMLElement;

        const eventTarget = e.target as HTMLElement;

        line.style.width = `${eventTarget.offsetWidth}px`;
        line.style.left = `${eventTarget.offsetLeft}px`;

        this._allContent.forEach((content) => {
          content.classList.remove('active');
        });
        this._allContent[index].classList.add('active');
      });
    });
  }

  addCommonEventPage() {
    // Add event close dialog when click outside
    this._dialogs.forEach((dialog) => {
      dialog.addEventListener('click', (e) => {
        const dialogDimensions = dialog.getBoundingClientRect();
        const mouseEvent = e as MouseEvent;
        if (
          mouseEvent.clientX < dialogDimensions.left ||
          mouseEvent.clientX > dialogDimensions.right ||
          mouseEvent.clientY < dialogDimensions.top ||
          mouseEvent.clientY > dialogDimensions.bottom
        ) {
          (<HTMLDialogElement>dialog).close();
        }
      });
    });

    this._cancelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closeAllDialog();
      });
    });

    // Prevent input =,-,e into amount input
    this._amountInputs.forEach((item) => {
      item.addEventListener(
        'keypress',
        (e) =>
          ['+', '-', 'e'].includes((<KeyboardEvent>e).key) &&
          e.preventDefault(),
      );
    });

    // Prevent user input at category search
    const categorySearchEl = document.querySelector(
      '.category-name',
    ) as Element;
    categorySearchEl.addEventListener('keydown', (e) => {
      e.preventDefault();
    });

    const logoutBtn = document.querySelector('.logout-text') as Element;
    logoutBtn.addEventListener('click', () => {
      clearAccessToken();

      window.location.replace('/login');
    });
  }

  closeAllDialog() {
    this._dialogs.forEach((dialog) => {
      (<HTMLDialogElement>dialog).close();
    });
  }

  removeActiveTab() {
    this._tabs.forEach((tab) => {
      tab.classList.remove('active');
    });
  }
}
