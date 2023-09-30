import { generateId } from '../helpers/data';

export default class Wallet {
  private readonly _id: number;

  private _walletName: string;

  private _inflow: number;

  private _outflow: number;

  private _idUser: number;

  constructor(
    walletName: string,
    inflow: number,
    outflow: number,
    idUser: number,
  ) {
    this._id = generateId();
    this._walletName = walletName;
    this._inflow = inflow;
    this._outflow = outflow;
    this._idUser = idUser;
  }

  get id() {
    return this._id;
  }

  get walletName() {
    return this._walletName;
  }

  get inflow() {
    return this._inflow;
  }

  get outflow() {
    return this._outflow;
  }

  get idUser() {
    return this._idUser;
  }

  get amountWallet() {
    return this._inflow + this._outflow;
  }
}
