import Transform from 'helpers/transform';
import { formatNumber } from '../../helpers/data';
import { Data } from 'global/types';
import Wallet from 'models/wallet';
import Transaction from 'models/transaction';
import Category from 'models/category';

export default class SummaryTabView {
  transform: Transform | null = null;

  wallet: Wallet | null = null;

  listTransactions: Transaction[] = [];

  listCategories: Category[] = [];

  initFunction(transform: Transform) {
    this.transform = transform;
  }

  subscribe() {
    this.transform!.create('summaryTabView', this.updateData.bind(this));
  }

  updateData(data: Data) {
    if (data.wallet) this.wallet = data.wallet;

    if (data.listTransactions) this.listTransactions = data.listTransactions;

    if (data.listCategories) this.listCategories = data.listCategories;
  }

  load() {
    const inflowValue = document.querySelector('.inflow__text--income')!;
    const outflowValue = document.querySelector('.outflow__text--outcome')!;
    const totalValue = document.querySelector('.summary__total')!;

    const { inflow } = this.wallet!;
    const { outflow } = this.wallet!;
    const total = inflow + outflow;

    inflowValue.textContent = `+$ ${formatNumber(inflow)}`;
    outflowValue.textContent = `-$ ${formatNumber(Math.abs(outflow))}`;
    totalValue.textContent = `${total >= 0 ? '+' : '-'}$ ${formatNumber(
      Math.abs(total),
    )}`;
  }
}
