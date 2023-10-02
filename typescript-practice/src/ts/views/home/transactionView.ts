import Transaction from 'models/transaction';
import defaultCategoryIcon from '../../../assets/images/question-icon.svg';
import CategoryView from './categoryView';
import Transform from 'helpers/transform';
import { Data, TError } from 'global/types';
import Wallet from 'models/wallet';
import Category from 'models/category';
import {
  ADD_TRANSACTION_SUCCESS,
  DEFAULT_MESSAGE,
  UPDATE_TRANSACTION_SUCCESS,
} from 'constants/messages/dialog';
import { renderRequiredText } from 'helpers/validatorForm';

export default class TransactionView {
  wallet: Wallet | null = null;

  listTransactions: Transaction[] = [];

  listCategories: Category[] = [];

  categoryView: CategoryView;

  addTransactionBtn: HTMLElement | null = null;

  transactionDialog: HTMLDialogElement | null = null;

  transactionForm: HTMLFormElement | null = null;

  toggleLoaderSpinner: (() => void) | null = null;

  deleteTransaction: ((idTransaction: number) => Promise<void>) | null = null;

  loadTransactionData: (() => Promise<void>) | null = null;

  updateAmountWallet: (() => Promise<void>) | null = null;

  loadData: (() => Promise<void>) | null = null;

  showSuccessToast: ((title: string, message: string) => void) | null = null;

  showErrorToast: ((error: string | TError) => void) | null = null;

  saveTransaction: ((transaction: Transaction) => Promise<void>) | null = null;

  transform: Transform | null = null;

  constructor(categoryView: CategoryView) {
    this.addTransactionBtn = document.getElementById('addTransaction');
    this.transactionDialog = document.getElementById(
      'transactionDialog',
    ) as HTMLDialogElement;
    this.transactionForm = <HTMLFormElement>(
      document.getElementById('formAddTransaction')
    );

    this.handlerEventTransactionDialog();

    this.categoryView = categoryView;
  }

  initFunction(
    toggleLoaderSpinner: () => void,
    deleteTransaction: (idTransaction: number) => Promise<void>,
    loadTransactionData: () => Promise<void>,
    updateAmountWallet: () => Promise<void>,
    loadData: () => Promise<void>,
    showSuccessToast: (title: string, message: string) => void,
    showErrorToast: (error: string | TError) => void,
    saveTransaction: (transaction: Transaction) => Promise<void>,
    transform: Transform | null,
  ) {
    this.toggleLoaderSpinner = toggleLoaderSpinner;
    this.deleteTransaction = deleteTransaction;
    this.loadTransactionData = loadTransactionData;
    this.updateAmountWallet = updateAmountWallet;
    this.loadData = loadData;
    this.showSuccessToast = showSuccessToast;
    this.showErrorToast = showErrorToast;
    this.saveTransaction = saveTransaction;
    this.transform = transform;
  }

  subscribe() {
    this.transform!.create('transactionView', this.updateData.bind(this));
  }

  sendData() {
    const data: Data = {
      wallet: this.wallet!,
      listTransactions: this.listTransactions!,
    };

    this.transform!.onSendSignal('transactionView', data);
  }

  updateData(data: Data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.listTransactions) this.listTransactions = data.listTransactions;

    if (data.listCategories) this.listCategories = data.listCategories;
  }

  handlerEventTransactionDialog() {
    this.transactionDialog!.addEventListener('submit', (e) => {
      e.preventDefault();
      this.clearErrorTransactionDialog();
      this.submitTransactionDialog();
    });

    this.transactionDialog!.addEventListener('input', () => {
      this.changeBtnStyleTransactionDialog();
      this.clearErrorTransactionDialog();
    });

    // Add delete transaction event
    this.deleteTransactionEvent();

    this.addTransactionBtn!.addEventListener('click', () => {
      this.showTransactionDialog();
    });

    this.handlerCategoryFieldEvent();
  }

  handlerCategoryFieldEvent() {
    const categoryField = this.transactionForm!.querySelector(
      "[name='category_name']",
    );

    categoryField!.addEventListener('click', () => {
      this.clearErrorTransactionDialog();
    });
  }

  clearErrorTransactionDialog() {
    // Clear error style
    const inputFieldEls =
      this.transactionDialog!.querySelectorAll('.form__input-field');
    const errorTextEls =
      this.transactionDialog!.querySelectorAll('.error-text');

    inputFieldEls.forEach((item) => {
      if (item.classList.contains('error-input'))
        item.classList.remove('error-input');
    });
    errorTextEls.forEach((item) => {
      if (item) item.remove();
    });
  }

  deleteTransactionEvent() {
    const deleteTransactionBtn = this.transactionDialog!.querySelector(
      '.form__delete-btn',
    ) as Element;

    deleteTransactionBtn.addEventListener('click', async () => {
      const idEl = this.transactionDialog!.querySelector(
        "[name='id_transaction']",
      ) as HTMLDataElement;

      if (idEl.value) {
        try {
          this.transactionDialog!.close();
          this.toggleLoaderSpinner!();

          await this.deleteTransaction!(+idEl.value);

          // Reload data
          await this.loadTransactionData!();
          await this.updateAmountWallet!();
          await this.loadData!();

          this.showSuccessToast!('Delete success!', DEFAULT_MESSAGE);
        } catch (error) {
          this.showErrorToast!(error as string | TError);
        }
        this.toggleLoaderSpinner!();
      }
    });
  }

  changeBtnStyleTransactionDialog() {
    const dateInput = (<HTMLDataElement>(
      this.transactionDialog!.querySelector("[name='selected_date']")
    )).value;
    const categoryName = (<HTMLDataElement>(
      this.transactionDialog!.querySelector("[name='category_name']")
    )).value;
    const amountInput = +(<HTMLDataElement>(
      this.transactionDialog!.querySelector("[name='amount']")
    )).value;
    const saveBtn = this.transactionDialog!.querySelector('.form__save-btn')!;

    saveBtn.classList.toggle(
      'active',
      <boolean>(dateInput && categoryName && amountInput >= 1),
    );
  }

  initValueTransactionDialog(idTransaction: number | null) {
    let categoryName: string;

    if (idTransaction) {
      // Get transaction object
      const transactionArr = this.listTransactions.filter(
        (obj) => obj.id === idTransaction,
      );
      const transaction = Object.assign({}, ...transactionArr);
      // Get category object
      const categoryArr = this.listCategories.filter(
        (obj) => obj.name === transaction.categoryName,
      );
      const category = Object.assign({}, ...categoryArr);

      const idEl = <HTMLDataElement>(
        this.transactionDialog!.querySelector("[name='id_transaction']")
      );
      const dateEl = <HTMLDataElement>(
        this.transactionDialog!.querySelector("[name='selected_date']"!)
      );
      const categoryEl = <HTMLDataElement>(
        this.transactionDialog!.querySelector("[name='category_name']")
      );
      const amountEl = <HTMLDataElement>(
        this.transactionDialog!.querySelector("[name='amount']")
      );
      const noteEl = <HTMLDataElement>(
        this.transactionDialog!.querySelector("[name='note']")
      );
      const iconEl = <HTMLImageElement>(
        this.transactionDialog!.querySelector('.category-icon')
      );

      idEl.value = transaction.id;
      dateEl.value = transaction.date;
      categoryEl.value = transaction.categoryName;
      amountEl.value = Math.abs(transaction.amount).toString();
      noteEl.value = transaction.note;
      iconEl.src = category.url;

      categoryName = categoryEl.value;
    }

    // Show delete button only if it is a edit form and not a income transaction
    const deleteBtn =
      this.transactionDialog!.querySelector('.form__delete-btn')!;
    const showDeleteBtn = () => {
      return idTransaction && categoryName !== 'Income';
    };

    deleteBtn.classList.toggle('hide', !showDeleteBtn());
  }

  async submitTransactionDialog() {
    try {
      const dateEl = <HTMLDataElement>(
        this.transactionForm!.querySelector("[name='selected_date']")
      );
      const categoryNameEl = <HTMLDataElement>(
        this.transactionForm!.querySelector("[name='category_name']")
      );
      const amountEl = <HTMLDataElement>(
        this.transactionForm!.querySelector("[name='amount']")
      );
      const noteEl = <HTMLDataElement>(
        this.transactionForm!.querySelector("[name='note']")
      );
      const idEl = <HTMLDataElement>(
        this.transactionForm!.querySelector("[name='id_transaction']")
      );
      const amount =
        categoryNameEl.value === 'Income' ? +amountEl.value : -+amountEl.value; // Check if this is a income transaction, amount must plus

      // Validate data user input
      if (
        this.validateTransactionForm(dateEl.value, categoryNameEl.value, amount)
      ) {
        this.toggleLoaderSpinner!();
        this.transactionDialog!.close();

        const transaction = new Transaction(
          +idEl.value,
          categoryNameEl.value,
          dateEl.value,
          noteEl.value,
          +amount,
          +this.wallet!.idUser,
        );

        await this.saveTransaction!(transaction);

        // Reload data
        await this.loadTransactionData!();
        await this.updateAmountWallet!();
        await this.loadData!();

        if (!idEl.value) {
          // Add success
          this.showSuccessToast!(ADD_TRANSACTION_SUCCESS, DEFAULT_MESSAGE);
        } else {
          // Update success
          this.showSuccessToast!(UPDATE_TRANSACTION_SUCCESS, DEFAULT_MESSAGE);
        }

        this.toggleLoaderSpinner!();
        this.clearInputTransactionForm();
      }
    } catch (error) {
      this.showErrorToast!(error as string | TError);
      this.toggleLoaderSpinner!();
    }
  }

  validateTransactionForm(date: string, categoryName: string, amount: number) {
    const inputFieldEls =
      this.transactionDialog!.querySelectorAll('.form__input-field');

    if (!date || !categoryName || !amount) {
      if (!date) {
        renderRequiredText('date', inputFieldEls[0]);
        inputFieldEls[0].classList.add('error-input');
      }

      if (!categoryName) {
        renderRequiredText('category', inputFieldEls[1]);
        inputFieldEls[1].classList.add('error-input');
      }

      if (!amount) {
        renderRequiredText('amount', inputFieldEls[2]);
        inputFieldEls[2].classList.add('error-input');
      }

      return false;
    }

    return true;
  }

  clearInputTransactionForm() {
    const categoryIcon = <HTMLImageElement>(
      this.transactionForm!.querySelector('.category-icon')
    );

    categoryIcon.src = defaultCategoryIcon;
    const keySearchCategory: string = ''; // Delete keyword search
    this.categoryView.renderCategoryList(
      keySearchCategory,
      this.listCategories,
    );
    this.transactionForm!.reset();
  }

  showTransactionDialog(idTransaction: number | null = null) {
    this.clearInputTransactionForm();

    // Init data transaction to dialog
    this.initValueTransactionDialog(idTransaction);

    if (!idTransaction)
      (<HTMLInputElement>(
        this.transactionDialog!.querySelector("[name='selected_date']")
      )).valueAsDate = new Date(); // Set default value for date input

    // Change style submit btn
    this.changeBtnStyleTransactionDialog();
    this.transactionDialog!.showModal();
  }
}
