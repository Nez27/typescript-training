import { generateId } from '../helpers/data';

export default class Wallet {
  id: string;

  walletName: string;

  inflow: number;

  outflow: number;

  idUser: string;

  constructor(
    walletName: string,
    inflow: number,
    outflow: number,
    idUser: string,
  ) {
    this.id = generateId();
    this.walletName = walletName;
    this.inflow = inflow;
    this.outflow = outflow;
    this.idUser = idUser;
  }
}
