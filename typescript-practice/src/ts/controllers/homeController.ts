import HomeView from 'views/home/homeView';
import Transform from '../helpers/transform';
import Service from 'services';
import View from 'views';
import Wallet from 'models/wallet';
import Transaction from 'models/transaction';

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

  handlerGetWalletByIdUser(idUser: number) {
    return this.service.walletService.getWalletByIdUser(idUser);
  }

  handlerSaveWallet(wallet: Wallet) {
    return this.service.walletService.saveWallet(wallet);
  }

  handlerSaveTransaction(transaction: Transaction) {
    return this.service.transactionService.saveTransaction(transaction);
  }

  // handlerGetAllCategory() {
  //   return this.service.categoryService.getAllCategory();
  // }

  // handlerGetAllTransactions(idUser) {
  //   return this.service.transactionService.getListTransactionByIdUser(idUser);
  // }

  // handlerDeleteTransaction(idTransaction) {
  //   return this.service.transactionService.deleteTransaction(idTransaction);
  // }

  init() {
    if (this.homeView) {
      this.homeView.initFunction(
        this.handlerGetInfoUserLogin.bind(this),
        this.handlerGetWalletByIdUser.bind(this),
        this.handlerSaveWallet.bind(this),
        this.handlerSaveTransaction.bind(this),
        new Transform(),
      );

      this.homeView.loadPage();

      // Subscribe listener data update
      this.homeView.subscribeListenerData();
    }
  }
}
