import Service from 'services';
import RegisterController from './registerController';
import View from 'views';
import LoginController from './loginController';
import HomeController from './homeController';

export default class Controller {
  public registerController: RegisterController;

  public loginController: LoginController;

  public homeController: HomeController;

  constructor(
    public service: Service,
    public view: View,
  ) {
    this.registerController = new RegisterController(service, view);
    this.loginController = new LoginController(service, view);
    this.homeController = new HomeController(service, view);
  }
}
