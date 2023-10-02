import { ItemTransaction } from 'global/types';

export default class TransactionDetail {
  constructor(
    public categoryName: string,
    public url: string,
    public totalTransaction: number,
    public totalAmount: number,
    public transactions: ItemTransaction[],
  ) {
    this.categoryName = categoryName;
    this.url = url;
    this.totalTransaction = totalTransaction;
    this.totalAmount = totalAmount;
    this.transactions = transactions;
  }
}
