import Service from 'services';
import RegisterController from './registerController';
import View from 'views';
import LoginController from './loginController';

export default class Controller {
  public registerController: RegisterController;

  public loginController: LoginController;

  constructor(
    public service: Service,
    public view: View,
  ) {
    this.registerController = new RegisterController(service, view);
    this.loginController = new LoginController(service, view);
  }
}
