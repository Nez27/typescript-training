import { Nullable } from 'global/types';
import User from 'models/user';
import Service from 'services';
import LoginView from 'views/loginView';

export default class LoginController {
  constructor(
    public service: Service,
    public loginView: Nullable<LoginView>,
  ) {
    this.service = service;
    this.loginView = loginView;
  }

  handlerLoginUser(email: string, password: string): Promise<boolean> {
    return this.service.userService.loginUser(email, password);
  }

  handlerGetInfoUserLogin(): Promise<User | null> {
    return this.service.userService.getInfoUserLogin();
  }

  init() {
    if (this.loginView) {
      this.loginView.loadPage(this.handlerGetInfoUserLogin.bind(this));
      this.loginView.addHandlerForm(this.handlerLoginUser.bind(this));
    }
  }
}
