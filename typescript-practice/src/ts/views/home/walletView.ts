import Transaction from '../../models/transaction';
import Wallet from '../../models/wallet';
import { renderRequiredText } from '../../helpers/validatorForm';
import Transform from 'helpers/transform';
import { Data, TError } from 'global/types';
import User from 'models/user';
import { FIRST_ADD_WALLET_NOTE } from 'constants/defaultVariable';
import { ADD_WALLET_SUCCESS, DEFAULT_MESSAGE } from 'constants/messages/dialog';

export default class WalletView {
  private _walletDialog: HTMLDialogElement | null = null;

  private _transform: Transform | null = null;

  private _toggleLoaderSpinner: (() => void) | null = null;

  private _saveWallet: ((wallet: Wallet) => Promise<void>) | null = null;

  private _saveTransaction:
    | ((transaction: Transaction) => Promise<void>)
    | null = null;

  private _loadTransactionData: (() => Promise<void>) | null = null;

  private _loadData: (() => Promise<void>) | null = null;

  private _loadEvent: (() => void) | null = null;

  private _showSuccessToast: ((title: string, message: string) => void) | null =
    null;

  private _showErrorToast: ((error: string | TError) => void) | null = null;

  private _user: User | null = null;

  private _wallet: Wallet | null = null;

  constructor() {
    this._walletDialog = document.getElementById(
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
    this._transform = transform;
    this._toggleLoaderSpinner = toggleLoaderSpinner;
    this._saveWallet = saveWallet;
    this._saveTransaction = saveTransaction;
    this._loadTransactionData = loadTransactionData;
    this._loadData = loadData;
    this._loadEvent = loadEvent;
    this._showSuccessToast = showSuccessToast;
    this._showErrorToast = showErrorToast;
  }

  subscribe() {
    this._transform!.create('walletView', this.updateData.bind(this));
  }

  sendData() {
    const data = {
      wallet: this._wallet!,
      user: this._user!,
    };

    this._transform!.onSendSignal('walletView', data);
  }

  updateData(data: Data) {
    if (data.wallet) this._wallet = data.wallet;

    if (data.user) this._user = data.user;
  }

  showDialog() {
    this._walletDialog!.showModal();
  }

  addHandlerEventWalletForm() {
    this._walletDialog!.addEventListener('submit', (e) => {
      e.preventDefault();

      this.clearErrorStyleWalletDialog();
      this.submitWalletForm();
    });

    this._walletDialog!.addEventListener('input', (e) => {
      const bodyDialog = (<Element>e.target!).closest('.dialog__body');

      this.changeBtnStyleWalletDialog(bodyDialog!);
      this.clearErrorStyleWalletDialog();
    });
  }

  clearErrorStyleWalletDialog() {
    const inputFieldEls =
      this._walletDialog!.querySelectorAll('.form__input-field');
    const errorTextEls = this._walletDialog!.querySelectorAll('.error-text');

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
        this._walletDialog!.close();
        this._toggleLoaderSpinner!();

        const wallet = new Wallet(walletName, +amount, 0, this._user!.id);
        this._wallet = wallet;

        this.sendData();

        await this._saveWallet!(wallet);
        // Transaction info
        const transaction = new Transaction(
          0,
          'Income',
          new Date().toISOString().slice(0, 10),
          FIRST_ADD_WALLET_NOTE,
          +amount,
          this._user!.id,
        );

        await this._saveTransaction!(transaction);
        // Load data and event
        await this._loadTransactionData!();
        await this._loadData!();
        this._loadEvent!();

        this._showSuccessToast!(ADD_WALLET_SUCCESS, DEFAULT_MESSAGE);

        this._toggleLoaderSpinner!();
      }
    } catch (error) {
      // Show toast error
      this._showErrorToast!(error as string | TError);
      this._toggleLoaderSpinner!();
    }
  }

  validateWalletDialog(walletName: string, amount: number) {
    const inputFieldEls =
      this._walletDialog!.querySelectorAll('.form__input-field');

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
