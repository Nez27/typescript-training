import EventDataTrigger from 'helpers/evDataTrigger';
import {
  createTransactionDetailObject,
  getAllCategoryNameInTransactions,
  getAllTransactionByCategoryName,
} from '../../helpers/data';
import { formatNumber } from '../../helpers/data';
import TransactionView from './transactionView';
import { DataTransfer, Nullable } from 'global/types';
import Wallet from 'models/wallet';
import Transaction from 'models/transaction';
import Category from 'models/category';
import TransactionDetail from 'models/transactionDetail';

export default class TransactionTabView {
  transactionView: TransactionView;

  evDataTrigger: Nullable<EventDataTrigger> = null;

  wallet: Nullable<Wallet> = null;

  listTransactions: Transaction[] = [];

  listCategories: Category[] = [];

  transactionDetails: TransactionDetail[] = [];

  constructor(transactionView: TransactionView) {
    this.transactionView = transactionView;
    this.addEventTransactionItem();
  }

  initFunction(evDataTrigger: EventDataTrigger) {
    this.evDataTrigger = evDataTrigger;
  }

  subscribe() {
    this.evDataTrigger!.create(
      'transactionTabView',
      this.updateData.bind(this),
    );
  }

  updateData(data: DataTransfer) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.listTransactions) this.listTransactions = data.listTransactions;

    if (data.listCategories) this.listCategories = data.listCategories;
  }

  async loadTransactionTab(): Promise<void> {
    // Load category
    // Init data first
    this.transactionDetails = this.loadTransactionDetailsData();
    const transactionEl = document.querySelector('.transaction')!;
    const listTransactionDetailEl =
      transactionEl.querySelector('.transaction__list')!;
    const markup: string[] = [];

    if (this.transactionDetails) {
      this.transactionDetails.forEach((transactionDetail) => {
        markup.push(this.transactionDetailMarkup(transactionDetail));
      });
    }
    listTransactionDetailEl.innerHTML = '';
    listTransactionDetailEl.insertAdjacentHTML('afterbegin', markup.join('\n'));
    // Load event
    this.addEventTransactionItem();
  }

  loadTransactionDetailsData(): TransactionDetail[] {
    // Get all category user have in transactions
    const listCategoryInTransaction = getAllCategoryNameInTransactions(
      this.listTransactions,
    );

    // Create transactions details object
    const tempList: TransactionDetail[] = listCategoryInTransaction.map(
      (categoryName) => {
        // Get category object from list category has been loaded.
        const category = this.listCategories.filter(
          (item) => item.name === categoryName,
        );

        const transactions = getAllTransactionByCategoryName(
          <string>categoryName,
          this.listTransactions,
        );

        return createTransactionDetailObject(
          Object.assign({}, ...category),
          transactions,
        );
      },
    );

    tempList.sort(
      (a, b) => parseInt(b.transactions[0].id) - parseInt(a.transactions[0].id),
    );

    return tempList;
  }

  // eslint-disable-next-line class-methods-use-this
  transactionDetailMarkup(transactionDetail: TransactionDetail): string {
    const itemTransaction = () => {
      const listMarkup: string[] = [];

      transactionDetail.transactions.forEach((transaction) => {
        const markup = `
          <div class="transaction__time" data-id=${transaction.id}>
            <div class="transaction__details">
              <p class="transaction__day">${transaction.day}</p>
              <div class="transaction__time-details">
                <p class="transaction__date-time">
                  ${transaction.fullDateString}
                </p>
                <p class="transaction__note">${
                  transaction.note === '' ? 'None' : transaction.note
                }</p>
              </div>
            </div>
            <p class="transaction__${
              transaction.amount >= 0 ? 'income' : 'outcome'
            }">${transaction.amount >= 0 ? '+' : '-'}$ ${formatNumber(
              Math.abs(transaction.amount),
            )}</p>
          </div>
        `;

        listMarkup.push(markup);
      });

      return listMarkup.join('\n');
    };

    return `
      <div class="transaction__item">
        <div class="transaction__category">
          <div class="transaction__category-infor">
            <div class="transaction__category-icon-container">
              <img
                class="icon-category"
                src="${transactionDetail.url}"
                alt="Transportation icon category"
              />
            </div>
            <div class="transaction__category-content">
              <p class="transaction__category-name">
                ${transactionDetail.categoryName}
              </p>
              <p class="transaction__total">${
                transactionDetail.totalTransaction
              } Transactions</p>
            </div>
          </div>
          <p class="transaction__category-total">${
            transactionDetail.totalAmount >= 0 ? '+' : '-'
          }$ ${formatNumber(Math.abs(transactionDetail.totalAmount))}</p>
        </div>
        <div class="transaction__line"></div>
        <!-- Transaction time item -->
        ${itemTransaction()}
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  addEventTransactionItem() {
    const transactionItemEl = document.querySelectorAll('.transaction__item');

    if (transactionItemEl) {
      transactionItemEl.forEach((item) => {
        item.addEventListener('click', (e) => {
          const transactionTime = (<Element>e.target).closest(
            '.transaction__time',
          );
          const categoryNameEl: HTMLInputElement = item.querySelector(
            '.transaction__category-name',
          )!;

          if (transactionTime) {
            const idTransaction = (<HTMLElement>transactionTime).dataset.id!;

            // If it is income transaction, don't show dialog
            if (
              categoryNameEl.textContent &&
              categoryNameEl.textContent.trim() !== 'Income'
            )
              this.transactionView.showTransactionDialog(idTransaction);
          }
        });
      });
    }
  }
}
