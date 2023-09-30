class LocalStorageService {
  private _localStorage: Storage;

  constructor() {
    this._localStorage = localStorage;
  }

  add(key: string, value: string): void {
    this._localStorage.setItem(key, value);
  }

  get(key: string): string | null {
    return this._localStorage.getItem(key);
  }

  remove(key: string): void {
    this._localStorage.removeItem(key);
  }

  clear(): void {
    this._localStorage.clear();
  }
}

export default new LocalStorageService();
