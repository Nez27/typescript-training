import Transaction from '../../models/transaction';
import { renderRequiredText } from '../../helpers/validatorForm';
import EventDataTrigger from 'helpers/evDataTrigger';
import Wallet from 'models/wallet';
import User from 'models/user';
import { DEFAULT_CATEGORY } from 'constants/config';
import { TOAST } from 'constants/messages';
import {
  IBudgetViewFunc,
  Data,
  Nullable,
  PromiseVoid,
  TError,
  VoidFunc,
} from 'global/types';

export default class BudgetView {
  budgetDialog: Nullable<HTMLDialogElement> = null;

  addBudgetBtn: Nullable<HTMLElement> = null;

  evDataTrigger: Nullable<EventDataTrigger> = null;

  toggleLoaderSpinner: Nullable<VoidFunc> = null;

  saveTransaction: Nullable<(transaction: Transaction) => Promise<void>> = null;

  loadTransactionData: Nullable<PromiseVoid> = null;

  updateAmountWallet: Nullable<PromiseVoid> = null;

  loadData: Nullable<PromiseVoid> = null;

  showSuccessToast: Nullable<(title: string, message: string) => void> = null;

  showErrorToast: Nullable<(error: TError) => void> = null;

  wallet: Nullable<Wallet> = null;

  user: Nullable<User> = null;

  constructor() {
    this.budgetDialog = document.getElementById(
      'budgetDialog',
    ) as HTMLDialogElement;
    this.addBudgetBtn = document.getElementById('addBudget');

    this.handlerEventBudgetView();
  }

  initFunction(func: IBudgetViewFunc) {
    this.showErrorToast = func.showErrorToast;
    this.showSuccessToast = func.showSuccessToast;
    this.toggleLoaderSpinner = func.toggleLoaderSpinner;
    this.saveTransaction = func.saveTransaction;
    this.loadTransactionData = func.loadTransactionData;
    this.updateAmountWallet = func.updateAmountWallet;
    this.loadData = func.loadData;

    this.evDataTrigger = EventDataTrigger.Instance;
  }

  subscribe() {
    this.evDataTrigger!.create('budgetView', this.updateData.bind(this));
  }

  sendData() {
    const data = { wallet: this.wallet! };

    this.evDataTrigger!.onSendSignal('budgetView', data);
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

  async submitBudgetForm(): Promise<void> {
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
          '',
          DEFAULT_CATEGORY.INCOME,
          date,
          note,
          +amount,
          this.wallet!.idUser,
        );

        await this.saveTransaction!(transaction);

        // Reload data
        await this.loadTransactionData!();
        await this.updateAmountWallet!();
        await this.loadData!();

        // Hide loader spinner
        this.toggleLoaderSpinner!();

        // Show success message
        this.showSuccessToast!(
          TOAST.ADD_TRANSACTION_SUCCESS,
          TOAST.DEFAULT_MESSAGE,
        );

        (<HTMLFormElement>document.getElementById('formAddBudget')!).reset();
      }
    } catch (error) {
      this.showErrorToast!(error as TError);
    }
  }

  validateBudgetForm(date: string, amount: number): boolean {
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
