import Controller from './controllers/index';
import Service from './services/index';
import View from './views/index';

export default class App {
  private _controller: Controller;

  constructor() {
    this._controller = new Controller(new Service(), new View());
  }

  start() {
    this._controller.registerController.init();
    this._controller.loginController.init();
  }
}
