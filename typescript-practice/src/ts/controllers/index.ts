import Service from 'services';
import RegisterController from './registerController';
import View from 'views';

export default class Controller {
  public registerController: RegisterController;

  constructor(
    public service: Service,
    public view: View,
  ) {
    this.registerController = new RegisterController(service, view);
  }
}
