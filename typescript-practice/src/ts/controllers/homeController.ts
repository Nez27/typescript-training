import HomeView from 'views/home/homeView';
import Transform from '../helpers/transform';
import Service from 'services';
import View from 'views';
import Wallet from 'models/wallet';
import Transaction from 'models/transaction';
import Category from 'models/category';

export default class HomeController {
  public homeView: HomeView | null = null;

  constructor(
    public service: Service,
    public view: View,
  ) {
    this.service = service;
    this.homeView = view.homeView;
  }

  handlerGetInfoUserLogin() {
    return this.service.userService.getInfoUserLogin();
  }

  handlerGetWalletByIdUser(idUser: string): Promise<Wallet | null> {
    return this.service.walletService.getWalletByIdUser(idUser);
  }

  handlerSaveWallet(wallet: Wallet): Promise<void> {
    return this.service.walletService.saveWallet(wallet);
  }

  handlerSaveTransaction(transaction: Transaction): Promise<void> {
    return this.service.transactionService.saveTransaction(transaction);
  }

  handlerGetAllCategory(): Promise<Category[] | null> {
    return this.service.categoryService.getAllCategory();
  }

  handlerGetAllTransactions(idUser: string): Promise<Transaction[] | null> {
    return this.service.transactionService.getListTransactionByIdUser(idUser);
  }

  handlerDeleteTransaction(idTransaction: string): Promise<void> {
    return this.service.transactionService.deleteTransaction(idTransaction);
  }

  init() {
    if (this.homeView) {
      this.homeView.initFunction(
        this.handlerGetInfoUserLogin.bind(this),
        this.handlerGetWalletByIdUser.bind(this),
        this.handlerGetAllCategory.bind(this),
        this.handlerGetAllTransactions.bind(this),
        this.handlerSaveWallet.bind(this),
        this.handlerSaveTransaction.bind(this),
        this.handlerDeleteTransaction.bind(this),
        new Transform(),
      );

      this.homeView.loadPage();

      // Subscribe listener data update
      this.homeView.subscribeListenerData();
    }
  }
}
