import { getSubdirectoryURL } from 'helpers/url';
import LoginView from './loginView';
import RegisterView from './registerView';
import { URL } from 'constants/config';
import HomeView from './home/homeView';

export default class View {
  public registerView: RegisterView | null = null;

  public loginView: LoginView | null = null;

  public homeView: HomeView | null = null;

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
