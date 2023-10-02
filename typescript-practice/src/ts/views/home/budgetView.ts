import Transaction from '../../models/transaction';
import { renderRequiredText } from '../../helpers/validatorForm';
import { Data, TError } from 'global/types';
import Transform from 'helpers/transform';
import Wallet from 'models/wallet';
import User from 'models/user';
import { DEFAULT_CATEGORY } from 'constants/config';
import {
  ADD_TRANSACTION_SUCCESS,
  DEFAULT_MESSAGE,
} from 'constants/messages/dialog';

export default class BudgetView {
  budgetDialog: HTMLDialogElement | null = null;

  addBudgetBtn: HTMLElement | null = null;

  transform: Transform | null = null;

  toggleLoaderSpinner: (() => void) | null = null;

  saveTransaction: ((transaction: Transaction) => Promise<void>) | null = null;

  loadTransactionData: (() => Promise<void>) | null = null;

  updateAmountWallet: (() => Promise<void>) | null = null;

  loadData: (() => Promise<void>) | null = null;

  showSuccessToast: ((title: string, message: string) => void) | null = null;

  showErrorToast: ((error: string | TError) => void) | null = null;

  wallet: Wallet | null = null;

  user: User | null = null;

  constructor() {
    this.budgetDialog = document.getElementById(
      'budgetDialog',
    ) as HTMLDialogElement;
    this.addBudgetBtn = document.getElementById('addBudget');

    this.handlerEventBudgetView();
  }

  initFunction(
    showErrorToast: (error: string | TError) => void,
    showSuccessToast: (title: string, message: string) => void,
    toggleLoaderSpinner: () => void,
    saveTransaction: ((transaction: Transaction) => Promise<void>) | null,
    loadTransactionData: () => Promise<void>,
    updateAmountWallet: () => Promise<void>,
    loadData: () => Promise<void>,
    transform: Transform | null,
  ) {
    this.showErrorToast = showErrorToast;
    this.showSuccessToast = showSuccessToast;
    this.toggleLoaderSpinner = toggleLoaderSpinner;
    this.saveTransaction = saveTransaction;
    this.loadTransactionData = loadTransactionData;
    this.updateAmountWallet = updateAmountWallet;
    this.loadData = loadData;
    this.transform = transform;
  }

  subscribe() {
    this.transform!.create('budgetView', this.updateData.bind(this));
  }

  sendData() {
    const data = { wallet: this.wallet! };

    this.transform!.onSendSignal('budgetView', data);
  }

  updateData(data: Data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.user) this.user = data.user;
  }

  addHandlerEventBudgetForm() {
    this.budgetDialog!.addEventListener('submit', (e) => {
      e.preventDefault();

      this.clearErrorStyleBudgetForm();
      this.submitBudgetForm();
    });

    this.budgetDialog!.addEventListener('input', () => {
      this.changeBtnStyle();
      this.clearErrorStyleBudgetForm();
    });
  }

  clearErrorStyleBudgetForm() {
    // Clear error style
    const inputFieldEls =
      this.budgetDialog!.querySelectorAll('.form__input-field');
    const errorTexts = this.budgetDialog!.querySelectorAll('.error-text');

    inputFieldEls.forEach((item) => {
      if (item.classList.contains('error-input'))
        item.classList.remove('error-input');
    });

    errorTexts.forEach((item) => {
      if (item) item.remove();
    });
  }

  async submitBudgetForm() {
    try {
      const form = document.getElementById('formAddBudget') as HTMLFormElement;
      const formAddBudget = new FormData(form);
      const date = formAddBudget.get('selected_date') as string;
      const amount = formAddBudget.get('amount') as string;
      const note = formAddBudget.get('note') as string;

      // Validate data user input

      if (this.validateBudgetForm(date, +amount)) {
        this.toggleLoaderSpinner!(); // Enable loader spinner
        this.budgetDialog!.close(); // Close dialog

        const transaction = new Transaction(
          0,
          DEFAULT_CATEGORY.INCOME,
          date,
          note,
          +amount,
          +this.wallet!.idUser,
        );

        await this.saveTransaction!(transaction);

        // Reload data
        await this.loadTransactionData!();
        await this.updateAmountWallet!();
        await this.loadData!();

        // Hide loader spinner
        this.toggleLoaderSpinner!();

        // Show success message
        this.showSuccessToast!(ADD_TRANSACTION_SUCCESS, DEFAULT_MESSAGE);

        (<HTMLFormElement>document.getElementById('formAddBudget')!).reset();
      }
    } catch (error) {
      this.showErrorToast!(error as string | TError);
    }
  }

  validateBudgetForm(date: string, amount: number) {
    const inputFieldEl =
      this.budgetDialog!.querySelectorAll('.form__input-field');

    if (!date || !amount) {
      if (!date) {
        renderRequiredText('date', inputFieldEl[0]);
        inputFieldEl[0].classList.add('error-input');
      }

      if (!amount) {
        renderRequiredText('amount', inputFieldEl[1]);
        inputFieldEl[1].classList.add('error-input');
      }

      return false;
    }

    return true;
  }

  changeBtnStyle() {
    const date = (<HTMLDataElement>(
      this.budgetDialog!.querySelector('.input-date')!
    )).value;
    const amount = +(<HTMLDataElement>(
      this.budgetDialog!.querySelector('.form__input-balance')!
    )).value;
    const saveBtn = this.budgetDialog!.querySelector('.form__save-btn')!;

    if (date.trim() && amount >= 1) {
      saveBtn.classList.add('active');
    } else {
      saveBtn.classList.remove('active');
    }
  }

  handlerEventBudgetView() {
    this.addBudgetBtn!.addEventListener('click', () => {
      // Set default value for date input
      (<HTMLInputElement>(
        this.budgetDialog!.querySelector("[name='selected_date']")
      ))!.valueAsDate = new Date();

      this.budgetDialog!.showModal();
    });

    this.addHandlerEventBudgetForm();
  }
}
