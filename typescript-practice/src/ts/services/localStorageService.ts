class LocalStorageService {
  localStorage: Storage;

  constructor() {
    this.localStorage = localStorage;
  }

  add(key: string, value: string) {
    this.localStorage.setItem(key, value);
  }

  get(key: string): string | null {
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
