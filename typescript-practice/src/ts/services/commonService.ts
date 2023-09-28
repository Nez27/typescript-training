import {
  timeOutConnect,
  convertDataObjectToModel,
  convertModelToDataObject,
} from '../helpers/helpers';
import { DataObject } from '../global/types';
import FirebaseService from './firebaseService';

export default class CommonService<T extends DataObject> {
  private defaultPath: string = '/';
  private firebaseService = FirebaseService;

  /**
   * Connect to Firebase Database
   */
  connectToDb() {
    this.firebaseService.reconnect();
  }

  /**
   * Save data on database
   * @param {*} data The data wants to save on database
   * @param {string} path The path of database
   */
  async save(model: T): Promise<void> {
    this.connectToDb();
    const results: T = convertModelToDataObject(model);

    const saveData = this.firebaseService.save(
      results.data,
      this.defaultPath + results.id,
    );

    await timeOutConnect(saveData);
  }

  /**
   *
   * @param {string} id The string of data object
   * @param {string} path The path of database
   * @returns {Object || null} Return the object if has, otherwise return null
   */
  async getDataFromId(
    id: string,
    path: string = this.defaultPath,
  ): Promise<object | null> {
    this.connectToDb();

    const data = await timeOutConnect(
      this.firebaseService.getDataFromId(id, path),
    );

    if (typeof data === 'object') return data;

    return null;
  }

  async getAllDataFromPath(path = this.defaultPath): Promise<object[] | null> {
    this.connectToDb();

    const results = await timeOutConnect(
      this.firebaseService.getAllDataFromPath(path),
    );

    if (typeof results === 'object') {
      // Convert format object
      return results.map((data) => {
        const tempData = data as DataObject;

        return convertDataObjectToModel(tempData);
      });
    }

    return null;
  }

  async getListDataFromProp(
    property: string,
    value: object,
    path: string = this.defaultPath,
  ): Promise<object[] | null> {
    this.connectToDb();

    const results = await timeOutConnect(
      this.firebaseService.getListDataFromProp(path, property, value),
    );

    if (results && typeof results === 'object') {
      // Convert format object

      return results.map((data) => {
        const tempData = data as DataObject;

        return convertDataObjectToModel(tempData);
      });
    }

    return null;
  }

  async deleteData(
    id: string,
    path = this.defaultPath,
  ): Promise<string | void> {
    this.connectToDb();

    await timeOutConnect(this.firebaseService.delete(id, path));
  }
}
