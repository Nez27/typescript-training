import { LOCAL_STORAGE } from '../constants/config';
import { createToken } from '../helpers/data';
import User from '../models/user';
import CommonService from './commonService';
import LocalStorageService from './localStorageService';

export default class UserService {
  private _commonService: CommonService<User>;

  constructor() {
    this._commonService = new CommonService<User>('users/');
  }

  /**
   * Save user into database
   * @param {Object} user The user object need to be saved into database
   */
  async saveUser(user: User): Promise<void> {
    await this._commonService.save(user);
  }

  /**
   * Check user exist in database
   * @param {string} email Email to find user
   * @returns {boolean} Return true if find, otherwise return false
   */
  async isValidUser(email: string): Promise<boolean> {
    const userExist = await this.getUserByEmail(email);

    return !!userExist;
  }

  /**
   * Get user data from email
   * @param {string} email Email user
   * @returns {Object || null} Return new User Object if find, otherwise return null.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this._commonService.getDataFromProp('email', email);

    return result || null;
  }

  /**
   * Validate user info
   * @param {string} email The email user input
   * @param {*} password The password user input
   * @returns {boolean} Return true if match info on database, otherwise return false
   */
  async loginUser(email: string, password: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);

    // Check password
    if (user && user.password === password) {
      // Create token for user
      await this.createTokenUser(email);

      return true;
    }

    return false;
  }

  /**
   * Create token for user on database
   * @param {string} email The email user need to be create token
   */
  async createTokenUser(email: string): Promise<void> {
    const user = await this.getUserByEmail(email);
    if (user) {
      const newUserData = user;

      // Add token to user object
      newUserData.accessToken = createToken();

      this._commonService.save(newUserData);

      // Add access token to local storage
      LocalStorageService.add(
        LOCAL_STORAGE.ACCESS_TOKEN,
        newUserData.accessToken,
      );
    }
  }

  async getInfoUserLogin(): Promise<User | null> {
    // Find access token
    const accessToken = LocalStorageService.get(LOCAL_STORAGE.ACCESS_TOKEN);

    if (accessToken) {
      const user = await this.getUserByToken(accessToken);

      return user;
    }

    return null;
  }

  /**
   * Get user data from token access
   * @param {string} accessToken Access token user
   * @returns {Object || null} Return new User Object if find, otherwise return null.
   */
  async getUserByToken(accessToken: string): Promise<User | null> {
    const result = await this._commonService.getDataFromProp(
      'accessToken',
      accessToken,
    );

    return result || null;
  }

  static clearAccessToken(): void {
    LocalStorageService.remove(LOCAL_STORAGE.ACCESS_TOKEN);
  }
}
