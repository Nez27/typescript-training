import { getSubdirectoryURL } from 'helpers/url';
import LoginView from './loginView';
import RegisterView from './registerView';
import { URL } from 'constants/config';
import HomeView from './home/homeView';
import { Nullable } from 'global/types';

export default class View {
  public registerView: Nullable<RegisterView> = null;

  public loginView: Nullable<LoginView> = null;

  public homeView: Nullable<HomeView> = null;

  constructor() {
    switch (getSubdirectoryURL()) {
      case URL.LOGIN:
        this.loginView = new LoginView();
        break;
      case URL.REGISTER:
        this.registerView = new RegisterView();
        break;
      case URL.HOME:
        this.homeView = new HomeView();
      default:
    }
  }
}
