import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  goOffline,
  goOnline,
  onValue,
  remove,
  Database,
} from 'firebase/database';
import { DATABASE_URL } from '../constants/config';

class FirebaseService {
  private app: FirebaseApp;
  private db: Database;

  constructor() {
    const firebaseConfig = {
      databaseURL: DATABASE_URL,
    };
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase(this.app);
  }

  /**
   * Save data in database
   * @param {Object} data The object need to save into database
   * @param {string} path The path of database need to be save
   * @returns {Promise} Return the resolves when write to database completed
   */
  save(data: object, path: string): Promise<void> {
    return set(ref(this.db, path), data);
  }

  delete(id: string, path: string): Promise<void> {
    return remove(ref(this.db, path + id));
  }

  /**
   * Disconnect to database
   */
  disconnect(): void {
    goOffline(this.db);
  }

  /**
   * Reconnect to database
   */
  reconnect(): void {
    goOnline(this.db);
  }

  /**
   * Find id of value by property in database
   * @param {string} path The path of database to be found
   * @param {string} property The property of the value need to be found
   * @param {value} value The value to compare in database
   * @returns {Promise} Return the resolve when find completed
   */
  getDataFromProp(
    path: string,
    property: string,
    value: object,
  ): Promise<object | null> {
    return new Promise((resolve) => {
      onValue(
        ref(this.db, path),
        (snapshot) => {
          let id: string | null = null;
          let data: object | null = null;
          let result: object | null = null;

          // snapshot is a type of data by Firebase define
          snapshot.forEach((childSnapshot) => {
            const dataTemp = childSnapshot.val();

            if (dataTemp[property] === value) {
              id = childSnapshot.key;
              data = dataTemp;
            }
          });

          if (id && data) {
            result = { id, data };
          }

          resolve(result);
        },
        {
          onlyOnce: true,
        },
      );
    });
  }

  /**
   * Get data object from Id
   * @param {string} id The id of data object
   * @param {string} path The path of data save in database
   * @returns {Promise} Return new Promise
   */
  getDataFromId(id: string, path: string): Promise<object> {
    return new Promise((resolve) => {
      onValue(
        ref(this.db, path + id),
        (snapshot) => {
          resolve(snapshot.val());
        },
        {
          onlyOnce: true,
        },
      );
    });
  }

  getAllDataFromPath(path: string): Promise<object[]> {
    return new Promise((resolve) => {
      onValue(
        ref(this.db, path),
        (snapshot) => {
          let listData: object[] = [];

          // snapshot is a type of data by Firebase define
          snapshot.forEach((childSnapshot) => {
            let id: string | null = null;
            let data: object | null = null;

            id = childSnapshot.key;
            data = childSnapshot.val();

            listData.push({ id, data });
          });

          resolve(listData);
        },
        {
          onlyOnce: true,
        },
      );
    });
  }

  getListDataFromProp(
    path: string,
    property: string,
    value: object,
  ): Promise<object[]> {
    return new Promise((resolve) => {
      onValue(
        ref(this.db, path),
        (snapshot) => {
          let id: string;
          let data: object;
          const listData: object[] = [];

          // snapshot is a type of data by Firebase define
          snapshot.forEach((childSnapshot) => {
            const dataTemp = childSnapshot.val();

            if (dataTemp[property] === value) {
              id = childSnapshot.key;
              data = dataTemp;

              listData.push({ id, data });
            }
          });
          resolve(listData);
        },
        {
          onlyOnce: true,
        },
      );
    });
  }
}

export default new FirebaseService();
