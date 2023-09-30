import Transaction from 'models/transaction';
import CommonService from './commonService';

export default class TransactionService extends CommonService<Transaction> {
  constructor() {
    super();

    this.defaultPath = 'transactions/';
  }

  /**
   * Save transaction into database
   * @param {Object} transaction The wallet object need to be saved into database
   */
  async saveTransaction(transaction: Transaction): Promise<void> {
    await this.save(transaction);
  }

  async getListTransactionByIdUser(
    idUser: number,
  ): Promise<Transaction | null> {
    const results = this.getListDataFromProp(
      'idUser',
      idUser.toString(),
      this.defaultPath,
    );

    return results || null;
  }

  async deleteTransaction(idTransaction: number) {
    await this.deleteData(idTransaction);
  }
}
