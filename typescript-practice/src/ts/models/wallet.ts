import { generateId } from '../helpers/data';

export default class Wallet {
  id: number;

  walletName: string;

  inflow: number;

  outflow: number;

  idUser: number;

  constructor(
    walletName: string,
    inflow: number,
    outflow: number,
    idUser: number,
  ) {
    this.id = generateId();
    this.walletName = walletName;
    this.inflow = inflow;
    this.outflow = outflow;
    this.idUser = idUser;
  }
}
