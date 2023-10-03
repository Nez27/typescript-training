import Transaction from '../../models/transaction';
import Wallet from '../../models/wallet';
import { renderRequiredText } from '../../helpers/validatorForm';
import EventDataTrigger from 'helpers/evDataTrigger';
import {
  DataTransfer,
  IWalletViewFunc,
  Nullable,
  PromiseVoid,
  TError,
  VoidFunc,
} from 'global/types';
import User from 'models/user';
import { FIRST_ADD_WALLET_NOTE } from 'constants/defaultVariable';
import { TOAST } from 'constants/messages';

export default class WalletView {
  walletDialog: Nullable<HTMLDialogElement> = null;

  evDataTrigger: Nullable<EventDataTrigger> = null;

  toggleLoaderSpinner: Nullable<VoidFunc> = null;

  saveWallet: Nullable<(wallet: Wallet) => Promise<void>> = null;

  saveTransaction: Nullable<(transaction: Transaction) => Promise<void>> = null;

  loadTransactionData: Nullable<PromiseVoid> = null;

  loadData: Nullable<PromiseVoid> = null;

  loadEvent: Nullable<VoidFunc> = null;

  showSuccessToast: ((title: string, message: string) => void) | null = null;

  showErrorToast: ((error: TError) => void) | null = null;

  user: User | null = null;

  wallet: Wallet | null = null;

  constructor() {
    this.walletDialog = document.getElementById(
      'walletDialog',
    ) as HTMLDialogElement;

    this.addHandlerEventWalletForm();
  }

  initFunction(func: IWalletViewFunc) {
    this.toggleLoaderSpinner = func.toggleLoaderSpinner;
    this.saveWallet = func.saveWallet;
    this.saveTransaction = func.saveTransaction;
    this.loadTransactionData = func.loadTransactionData;
    this.loadData = func.loadData;
    this.loadEvent = func.loadEvent;
    this.showSuccessToast = func.showSuccessToast;
    this.showErrorToast = func.showErrorToast;

    this.evDataTrigger = EventDataTrigger.Instance;
  }

  subscribe() {
    this.evDataTrigger!.create('walletView', this.updateData.bind(this));
  }

  sendData() {
    const data = {
      wallet: this.wallet!,
      user: this.user!,
    };

    this.evDataTrigger!.onSendSignal('walletView', data);
  }

  updateData(data: DataTransfer) {
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

  async submitWalletForm(): Promise<void> {
    try {
      // Wallet info
      const form = document.getElementById('walletForm') as HTMLFormElement;
      const walletForm = new FormData(form);
      const walletName = walletForm.get('walletName') as string;
      const amount = walletForm.get('amount') as string;

      if (this.validateWalletDialog(walletName, +amount)) {
        this.walletDialog!.close();
        this.toggleLoaderSpinner!();

        const wallet = new Wallet('', walletName, +amount, 0, this.user!.id);
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

        this.showSuccessToast!(TOAST.ADD_WALLET_SUCCESS, TOAST.DEFAULT_MESSAGE);

        this.toggleLoaderSpinner!();
      }
    } catch (error) {
      // Show toast error
      this.showErrorToast!(error as TError);
      this.toggleLoaderSpinner!();
    }
  }

  validateWalletDialog(walletName: string, amount: number): boolean {
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
