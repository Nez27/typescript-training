class LocalStorageService {
  private localStorage: Storage;

  constructor() {
    this.localStorage = localStorage;
  }

  add(key: string, value: string) {
    this.localStorage.setItem(key, value);
  }

  get(key: string) {
    return this.localStorage.getItem(key);
  }

  remove(key: string) {
    this.localStorage.removeItem(key);
  }

  clear() {
    this.localStorage.clear();
  }
}

export default new LocalStorageService();
