import { BTN_CONTENT, TypeToast } from '../../constants/config';
import CommonView from '../commonView';
import { clearAccessToken, formatNumber } from '../../helpers/data';

import WalletView from './walletView';
import Wallet from 'models/wallet';
import EventDataTrigger from 'helpers/evDataTrigger';
import Transaction from 'models/transaction';
import User from 'models/user';
import {
  Data,
  IBudgetViewFunc,
  IHomeFunc,
  ITransactionViewFunc,
  IWalletViewFunc,
  Nullable,
  PromiseOrNull,
  TError,
} from 'global/types';
import { DEFAULT_TITLE_ERROR_TOAST } from 'constants/messages';
import { redirectToLoginPage } from 'helpers/url';
import Category from 'models/category';
import CategoryView from './categoryView';
import BudgetView from './budgetView';
import TransactionView from './transactionView';
import SummaryTabView from './summaryTabView';
import TransactionDetail from 'models/transactionDetail';
import TransactionTabView from './transactionTabView';

export default class HomeView extends CommonView {
  walletView: WalletView;

  categoryView: CategoryView;

  budgetView: BudgetView;

  transactionView: TransactionView;

  summaryTabView: SummaryTabView;

  transactionTabView: TransactionTabView;

  tabs: NodeListOf<Element>;

  allContent: NodeListOf<Element>;

  cancelBtns: NodeListOf<Element>;

  dialogs: NodeListOf<Element>;

  amountInputs: NodeListOf<Element>;

  user: Nullable<User> = null;

  wallet: Nullable<Wallet> = null;

  listTransactions: Transaction[] = [];

  transactionDetails: TransactionDetail[] = [];

  getInfoUserLogin: Nullable<PromiseOrNull<User>> = null;

  getWalletByIdUser: Nullable<(idUser: string) => Promise<Wallet | null>> =
    null;

  getAllCategory: Nullable<() => Promise<Category[] | null>> = null;

  getAllTransactions: Nullable<
    (idUser: string) => Promise<Transaction[] | null>
  > = null;

  deleteTransaction: Nullable<(idTransaction: string) => Promise<void>> = null;

  saveWallet: Nullable<(wallet: Wallet) => Promise<void>> = null;

  saveTransaction: Nullable<(transaction: Transaction) => Promise<void>> = null;

  evDataTrigger: Nullable<EventDataTrigger> = null;

  constructor() {
    super();

    this.tabs = document.querySelectorAll('.app__tab-item');
    this.allContent = document.querySelectorAll('.app__content-item');
    this.cancelBtns = document.querySelectorAll('.form__cancel-btn');
    this.dialogs = document.querySelectorAll('.dialog');

    this.amountInputs = document.querySelectorAll('.form__input-balance');

    this.walletView = new WalletView();
    this.categoryView = new CategoryView();
    this.budgetView = new BudgetView();
    this.transactionView = new TransactionView(this.categoryView);
    this.summaryTabView = new SummaryTabView();
    this.transactionTabView = new TransactionTabView(this.transactionView);

    this.initToast();
    this.initLoader();
    this.handleEventToast();
  }

  // ----------------------- Init function ----------------------- //
  initFunction(func: IHomeFunc) {
    this.getInfoUserLogin = func.getInfoUserLogin || null;
    this.getWalletByIdUser = func.getWalletByIdUser || null;
    this.getAllCategory = func.getAllCategory || null;
    this.getAllTransactions = func.getAllTransactions || null;
    this.saveWallet = func.saveWallet || null;
    this.saveTransaction = func.saveTransaction || null;
    this.deleteTransaction = func.deleteTransaction || null;

    this.evDataTrigger = EventDataTrigger.Instance;

    // Init function for child view
    this.initWalletViewFunction();
    this.initBudgetViewFunction();
    this.initTransactionViewFunction();
    this.initCategoryViewFunction();
    this.initSummaryTabViewFunction();
    this.initTransactionTabViewFunction();
  }

  initTransactionViewFunction() {
    const func: ITransactionViewFunc = {
      toggleLoaderSpinner: this.toggleLoaderSpinner.bind(this),
      deleteTransaction: this.deleteTransaction!,
      loadTransactionData: this.loadTransactionData.bind(this),
      updateAmountWallet: this.updateAmountWallet.bind(this),
      loadData: this.loadData.bind(this),
      showSuccessToast: this.showSuccessToast.bind(this),
      showErrorToast: this.showErrorToast.bind(this),
      saveTransaction: this.saveTransaction!,
    };

    this.transactionView.initFunction(func);
  }

  initBudgetViewFunction() {
    const func: IBudgetViewFunc = {
      showErrorToast: this.showErrorToast.bind(this),
      showSuccessToast: this.showSuccessToast.bind(this),
      toggleLoaderSpinner: this.toggleLoaderSpinner.bind(this),
      saveTransaction: this.saveTransaction!.bind(this),
      loadTransactionData: this.loadTransactionData.bind(this),
      updateAmountWallet: this.updateAmountWallet.bind(this),
      loadData: this.loadData.bind(this),
    };

    this.budgetView.initFunction(func);
  }

  initCategoryViewFunction() {
    this.categoryView.initFunction(this.getAllCategory!, this.evDataTrigger!);
  }

  initSummaryTabViewFunction() {
    this.summaryTabView.initFunction(this.evDataTrigger!);
  }

  initTransactionTabViewFunction() {
    this.transactionTabView.initFunction(this.evDataTrigger!);
  }

  initWalletViewFunction() {
    const func: IWalletViewFunc = {
      toggleLoaderSpinner: this.toggleLoaderSpinner.bind(this),
      saveWallet: this.saveWallet,
      saveTransaction: this.saveTransaction,
      loadTransactionData: this.loadTransactionData.bind(this),
      loadData: this.loadData.bind(this),
      loadEvent: this.loadEvent.bind(this),
      showSuccessToast: this.showSuccessToast.bind(this),
      showErrorToast: this.showErrorToast.bind(this),
    };

    this.walletView.initFunction(func);
  }
  // ----------------------- End ----------------------- //

  subscribeListenerData() {
    this.subscribe();
    this.transactionView.subscribe();
    this.budgetView.subscribe();
    this.summaryTabView.subscribe();
    this.transactionTabView.subscribe();
    this.walletView.subscribe();
  }

  async loadData(): Promise<void> {
    // Send data to other class
    this.sendData();

    await this.categoryView.loadCategory();

    await this.loadWalletUser();

    this.summaryTabView.load();

    this.transactionTabView.loadTransactionTab();

    await this.updateAmountWallet();
  }

  async loadPage(): Promise<void> {
    this.toggleLoaderSpinner();
    const user = await this.getInfoUserLogin!();

    if (!user) {
      // If user not login yet
      clearAccessToken();
      window.location.replace('/login');
    } else {
      // If user already login
      this.user = user;
      this.wallet = <Wallet>await this.getWalletByIdUser!(user.id);

      this.sendData();
      // Check user's wallet if have or not
      if (!this.wallet) {
        // Show add wallet dialog
        this.walletView.showDialog();
      } else {
        // Init data
        await this.loadTransactionData();
        await this.loadData();

        // Load event page
        this.loadEvent();
      }
    }

    this.toggleLoaderSpinner();
  }

  // ---------------------LOAD DATA---------------------//

  subscribe() {
    this.evDataTrigger!.create('homeView', this.updateData.bind(this));
  }

  sendData() {
    const data: Data = {
      wallet: this.wallet!,
      listTransactions: this.listTransactions!,
      user: this.user!,
    };

    this.evDataTrigger!.onSendSignal('homeView', data);
  }

  updateData(data: Data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.user) this.user = data.user;
  }

  /**
   * Load wallet user
   */
  async loadWalletUser(): Promise<void> {
    const wallet = this.wallet
      ? this.wallet
      : await this.getWalletByIdUser!(this.user!.id);
    const walletName = document.querySelector('.wallet__name');
    const walletPrice = document.querySelector('.wallet__price');
    const walletNameValue = wallet!.walletName;
    const walletAmountValue = wallet!.inflow + wallet!.outflow;

    const sign = walletAmountValue >= 0 ? '+' : '-';

    this.wallet = wallet; // Make wallet into global variable

    walletName!.textContent = walletNameValue;
    walletPrice!.textContent = `${sign}$ ${formatNumber(
      Math.abs(walletAmountValue),
    )}`; // Math.abs(walletAmountValue) to keep the value always > 0

    // Update amount wallet into database
    this.saveWallet!(this.wallet!);
  }

  async loadTransactionData(): Promise<void> {
    const data = await this.getAllTransactions!(this.wallet!.idUser);

    if (data) this.listTransactions = data;

    this.sendData();
  }

  async updateAmountWallet(): Promise<void> {
    let inflow = 0;
    let outflow = 0;
    // Init data first
    this.transactionDetails =
      this.transactionTabView!.loadTransactionDetailsData();

    this.transactionDetails.forEach((transaction) => {
      if (transaction.totalAmount >= 0) {
        inflow += transaction.totalAmount;
      } else {
        outflow -= transaction.totalAmount;
      }
    });
    // Reassign value for wallet user;
    this.wallet!.inflow = inflow;
    this.wallet!.outflow = -outflow;
    await this.saveWallet!(this.wallet!);
  }

  // ---------------------END--------------------- //

  // ---------------------TOAST--------------------- //
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
  showErrorToast(error: TError) {
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
  // ---------------------END--------------------- //

  // --------------------- HANDLER EVENT --------------------- //

  loadEvent() {
    this.addCommonEventPage();
    this.handlerTabsTransfer();
  }

  /**
   * Handle event when click on tabs
   */
  handlerTabsTransfer() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e: Event) => {
        this.removeActiveTab();
        tab.classList.add('active');

        const line = document.querySelector<HTMLElement>(
          '.app__line',
        ) as HTMLElement;

        const eventTarget = e.target as HTMLElement;

        line.style.width = `${eventTarget.offsetWidth}px`;
        line.style.left = `${eventTarget.offsetLeft}px`;

        this.allContent.forEach((content) => {
          content.classList.remove('active');
        });
        this.allContent[index].classList.add('active');
      });
    });
  }

  addCommonEventPage() {
    // Add event close dialog when click outside
    this.dialogs.forEach((dialog) => {
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

    this.cancelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closeAllDialog();
      });
    });

    // Prevent input =,-,e into amount input
    this.amountInputs.forEach((item) => {
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
    this.dialogs.forEach((dialog) => {
      (<HTMLDialogElement>dialog).close();
    });
  }

  removeActiveTab() {
    this.tabs.forEach((tab) => {
      tab.classList.remove('active');
    });
  }
}
