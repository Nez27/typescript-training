import Transaction from '../../models/transaction';
import Wallet from '../../models/wallet';
import { renderRequiredText } from '../../helpers/validatorForm';
import Transform from 'helpers/transform';
import { Data, TError } from 'global/types';
import User from 'models/user';
import { FIRST_ADD_WALLET_NOTE } from 'constants/defaultVariable';
import { ADD_WALLET_SUCCESS, DEFAULT_MESSAGE } from 'constants/messages/dialog';

export default class WalletView {
  walletDialog: HTMLDialogElement | null = null;

  transform: Transform | null = null;

  toggleLoaderSpinner: (() => void) | null = null;

  saveWallet: ((wallet: Wallet) => Promise<void>) | null = null;

  saveTransaction: ((transaction: Transaction) => Promise<void>) | null = null;

  loadTransactionData: (() => Promise<void>) | null = null;

  loadData: (() => Promise<void>) | null = null;

  loadEvent: (() => void) | null = null;

  showSuccessToast: ((title: string, message: string) => void) | null = null;

  showErrorToast: ((error: string | TError) => void) | null = null;

  user: User | null = null;

  wallet: Wallet | null = null;

  constructor() {
    this.walletDialog = document.getElementById(
      'walletDialog',
    ) as HTMLDialogElement;

    this.addHandlerEventWalletForm();
  }

  initFunction(
    transform: Transform | null,
    toggleLoaderSpinner: () => void,
    saveWallet: ((wallet: Wallet) => Promise<void>) | null,
    saveTransaction: ((transaction: Transaction) => Promise<void>) | null,
    loadTransactionData: () => Promise<void>,
    loadData: () => Promise<void>,
    loadEvent: () => void,
    showSuccessToast: (title: string, message: string) => void,
    showErrorToast: (error: string | TError) => void,
  ) {
    this.transform = transform;
    this.toggleLoaderSpinner = toggleLoaderSpinner;
    this.saveWallet = saveWallet;
    this.saveTransaction = saveTransaction;
    this.loadTransactionData = loadTransactionData;
    this.loadData = loadData;
    this.loadEvent = loadEvent;
    this.showSuccessToast = showSuccessToast;
    this.showErrorToast = showErrorToast;
  }

  subscribe() {
    this.transform!.create('walletView', this.updateData.bind(this));
  }

  sendData() {
    const data = {
      wallet: this.wallet!,
      user: this.user!,
    };

    this.transform!.onSendSignal('walletView', data);
  }

  updateData(data: Data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.user) this.user = data.user;
  }

  showDialog() {
    this.walletDialog!.showModal();
  }

  addHandlerEventWalletForm() {
    this.walletDialog!.addEventListener('submit', (e) => {
      e.preventDefault();

      this.clearErrorStyleWalletDialog();
      this.submitWalletForm();
    });

    this.walletDialog!.addEventListener('input', (e) => {
      const bodyDialog = (<Element>e.target!).closest('.dialog__body');

      this.changeBtnStyleWalletDialog(bodyDialog!);
      this.clearErrorStyleWalletDialog();
    });
  }

  clearErrorStyleWalletDialog() {
    const inputFieldEls =
      this.walletDialog!.querySelectorAll('.form__input-field');
    const errorTextEls = this.walletDialog!.querySelectorAll('.error-text');

    inputFieldEls.forEach((item) => {
      if (item.classList.contains('error-input'))
        item.classList.remove('error-input');
    });

    errorTextEls.forEach((item) => {
      if (item) item.remove();
    });
  }

  async submitWalletForm() {
    try {
      // Wallet info
      const form = document.getElementById('walletForm') as HTMLFormElement;
      const walletForm = new FormData(form);
      const walletName = walletForm.get('walletName') as string;
      const amount = walletForm.get('amount') as string;

      if (this.validateWalletDialog(walletName, +amount)) {
        this.walletDialog!.close();
        this.toggleLoaderSpinner!();

        const wallet = new Wallet(walletName, +amount, 0, this.user!.id);
        this.wallet = wallet;

        this.sendData();

        await this.saveWallet!(wallet);
        // Transaction info
        const transaction = new Transaction(
          '',
          'Income',
          new Date().toISOString().slice(0, 10),
          FIRST_ADD_WALLET_NOTE,
          +amount,
          this.user!.id,
        );

        await this.saveTransaction!(transaction);
        // Load data and event
        await this.loadTransactionData!();
        await this.loadData!();
        this.loadEvent!();

        this.showSuccessToast!(ADD_WALLET_SUCCESS, DEFAULT_MESSAGE);

        this.toggleLoaderSpinner!();
      }
    } catch (error) {
      // Show toast error
      this.showErrorToast!(error as string | TError);
      this.toggleLoaderSpinner!();
    }
  }

  validateWalletDialog(walletName: string, amount: number) {
    const inputFieldEls =
      this.walletDialog!.querySelectorAll('.form__input-field');

    if (!walletName || !amount) {
      if (!walletName) {
        renderRequiredText('wallet name', inputFieldEls[0]);
        inputFieldEls[0].classList.add('error-input');
      }

      if (!amount) {
        renderRequiredText('amount', inputFieldEls[2]);
        inputFieldEls[2].classList.add('error-input');
      }

      return false;
    }

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  changeBtnStyleWalletDialog(bodyDialog: Element) {
    const walletName = (<HTMLDataElement>(
      bodyDialog.querySelector('.form__input-text')
    ))!.value;
    const amount = +(<HTMLDataElement>(
      bodyDialog.querySelector('.form__input-balance')!
    )).value;
    const saveBtn = bodyDialog.querySelector('.form__save-btn');

    if (walletName.length >= 3 && amount >= 1) {
      saveBtn!.classList.add('active');
    } else {
      saveBtn!.classList.remove('active');
    }
  }
}
