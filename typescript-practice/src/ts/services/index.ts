import UserService from './userService';

export default class Service {
  public userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
}
