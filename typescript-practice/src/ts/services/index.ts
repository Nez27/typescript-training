import TransactionService from './transactionService';
import UserService from './userService';
import WalletService from './walletService';

export default class Service {
  public userService: UserService;

  public walletService: WalletService;

  public transactionService: TransactionService;

  constructor() {
    this.userService = new UserService();
    this.walletService = new WalletService();
    this.transactionService = new TransactionService();
  }
}
