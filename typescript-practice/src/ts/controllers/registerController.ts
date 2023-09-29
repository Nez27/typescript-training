import User from 'models/user';
import Service from 'services';
import View from 'views';
import RegisterView from 'views/registerView';

export default class RegisterController {
  public registerView: RegisterView;

  constructor(
    public service: Service,
    public view: View,
  ) {
    this.registerView = view.registerView;
    this.service = service;
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
