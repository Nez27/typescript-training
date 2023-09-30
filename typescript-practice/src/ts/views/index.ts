import { getSubdirectoryURL } from 'helpers/url';
import LoginView from './loginView';
import RegisterView from './registerView';
import { URL } from 'constants/config';

export default class View {
  public registerView: RegisterView | null = null;

  public loginView: LoginView | null = null;

  constructor() {
    switch (getSubdirectoryURL()) {
      case URL.LOGIN:
        this.loginView = new LoginView();
        break;
      case URL.REGISTER:
        this.registerView = new RegisterView();
        break;
      default:
    }
  }
}
