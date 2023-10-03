import Category from 'models/category';
import Transaction from 'models/transaction';
import User from 'models/user';
import Wallet from 'models/wallet';

export interface IDataObject<T> {
  id: string;
  data: T;
}

export class DataObject<T> {
  public id: string;

  public data: T;

  constructor(dataObject: IDataObject<T>) {
    this.id = dataObject?.id ?? null;
    this.data = <T>dataObject.data;
  }
}

export interface IError {
  title: string;
  message: string;
}

export type TError = string | IError;

export class CustomError extends Error {
  constructor(
    public title: string,
    message?: string,
  ) {
    super(message);
  }
}

export interface Data {
  wallet?: Wallet;
  listTransactions?: Transaction[];
  listCategories?: Category[];
  user?: User;
}

export interface ItemTransaction {
  id: string;
  day: string;
  fullDateString: string;
  note: string;
  amount: number;
}

export type Nullable<T> = T | null;
export type PromiseVoid = () => Promise<void>;
export type VoidFunc = () => void;
export type PromiseOrNull<T> = () => Promise<T | null>;

export interface IHomeFunc {
  getInfoUserLogin?: PromiseOrNull<User>;
  getWalletByIdUser?: (idUser: string) => Promise<Wallet | null>;
  getAllCategory?: PromiseOrNull<Category[]>;
  getAllTransactions?: (idUser: string) => Promise<Transaction[] | null>;
  saveWallet?: (wallet: Wallet) => Promise<void>;
  saveTransaction?: (transaction: Transaction) => Promise<void>;
  deleteTransaction?: (idTransaction: string) => Promise<void>;
}

export interface IBudgetViewFunc {
  showErrorToast: (error: TError) => void;
  showSuccessToast: (title: string, message: string) => void;
  toggleLoaderSpinner: VoidFunc;
  saveTransaction: Nullable<(transaction: Transaction) => Promise<void>>;
  loadTransactionData: PromiseVoid;
  updateAmountWallet: PromiseVoid;
  loadData: PromiseVoid;
}

export interface ITransactionViewFunc {
  toggleLoaderSpinner: VoidFunc;
  deleteTransaction: (idTransaction: string) => Promise<void>;
  loadTransactionData: PromiseVoid;
  updateAmountWallet: PromiseVoid;
  loadData: PromiseVoid;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (error: TError) => void;
  saveTransaction: (transaction: Transaction) => Promise<void>;
}

export interface IWalletViewFunc {
  toggleLoaderSpinner: () => void;
  saveWallet: ((wallet: Wallet) => Promise<void>) | null;
  saveTransaction: ((transaction: Transaction) => Promise<void>) | null;
  loadTransactionData: () => Promise<void>;
  loadData: () => Promise<void>;
  loadEvent: () => void;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (error: TError) => void;
}
