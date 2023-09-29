import Controller from './controllers/index';
import Service from './services/index';
import View from './views/index';

export default class App {
  private controller: Controller;

  constructor() {
    this.controller = new Controller(new Service(), new View());
  }

  start() {
    this.controller.registerController.init();
  }
}
