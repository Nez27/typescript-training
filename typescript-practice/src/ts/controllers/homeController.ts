import HomeView from 'views/home/homeView';
import Service from 'services';
import Wallet from 'models/wallet';
import Transaction from 'models/transaction';
import Category from 'models/category';
import { IHomeFunc, Nullable } from 'global/types';

export default class HomeController {
  constructor(
    public service: Service,
    public homeView: Nullable<HomeView>,
  ) {
    this.service = service;
    this.homeView = homeView;
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
      const func: IHomeFunc = {
        getInfoUserLogin: this.handlerGetInfoUserLogin.bind(this),
        getWalletByIdUser: this.handlerGetWalletByIdUser.bind(this),
        getAllCategory: this.handlerGetAllCategory.bind(this),
        getAllTransactions: this.handlerGetAllTransactions.bind(this),
        saveWallet: this.handlerSaveWallet.bind(this),
        saveTransaction: this.handlerSaveTransaction.bind(this),
        deleteTransaction: this.handlerDeleteTransaction.bind(this),
      };

      this.homeView.initFunction(func);

      this.homeView.loadPage();

      // Subscribe listener data update
      this.homeView.subscribeListenerData();
    }
  }
}
