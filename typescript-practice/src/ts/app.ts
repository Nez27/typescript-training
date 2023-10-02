import Controller from './controllers/index';
import Service from './services/index';
import View from './views/index';

export default class App {
  controller: Controller;

  constructor() {
    this.controller = new Controller(new Service(), new View());
  }

  start() {
    this.controller.registerController.init();
    this.controller.loginController.init();
    this.controller.homeController.init();
  }
}
