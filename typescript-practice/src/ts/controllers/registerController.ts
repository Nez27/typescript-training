import { Nullable } from 'global/types';
import User from 'models/user';
import Service from 'services';
import RegisterView from 'views/registerView';

export default class RegisterController {
  constructor(
    public service: Service,
    public registerView: Nullable<RegisterView>,
  ) {
    this.service = service;
    this.registerView = registerView;
  }

  handlerCheckUserValid(email: string): Promise<boolean> {
    return this.service.userService.isValidUser(email);
  }

  handlerSaveUser(user: User): Promise<void> {
    return this.service.userService.saveUser(user);
  }

  handlerGetInfoUserLogin(): Promise<User | null> {
    return this.service.userService.getInfoUserLogin();
  }

  init() {
    if (this.registerView) {
      this.registerView.loadPage(this.handlerGetInfoUserLogin.bind(this));
      this.registerView.addHandlerForm(
        this.handlerCheckUserValid.bind(this),
        this.handlerSaveUser.bind(this),
      );
      this.registerView.addHandlerInputFormChange();
    }
  }
}
