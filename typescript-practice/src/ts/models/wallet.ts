import { generateId } from '../helpers/data';

export default class Wallet {
  constructor(
    public id: string,
    public walletName: string,
    public inflow: number,
    public outflow: number,
    public idUser: string,
  ) {
    this.id = id ? id : generateId();
    this.walletName = walletName;
    this.inflow = inflow;
    this.outflow = outflow;
    this.idUser = idUser;
  }
}
