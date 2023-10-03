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
    idUser: string,
  ): Promise<Transaction[] | null> {
    const results = await this.getListDataFromProp(
      'idUser',
      idUser,
      this.defaultPath,
    );

    return results || null;
  }

  async deleteTransaction(idTransaction: string): Promise<void> {
    await this.deleteData(idTransaction);
  }
}
