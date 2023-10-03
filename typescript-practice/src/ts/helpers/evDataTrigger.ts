import { DataTransfer } from 'global/types';

type TSignal = {
  [key: string]: {
    name: string;
    handler: (value: DataTransfer) => void;
  };
};

export default class EventDataTrigger {
  private static _instance: EventDataTrigger;

  public signal: TSignal;

  constructor() {
    this.signal = {};
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  onSendSignal(fromClass: string, value: DataTransfer) {
    Object.keys(this.signal).forEach((key) => {
      const item = this.signal[key as keyof TSignal];

      // Same receiver
      if (item.name === fromClass) {
        return;
      }

      // Send signal
      const { handler } = this.signal[key];
      if (handler) {
        handler(value);
      }
    });
  }

  create(
    className: string,
    handler: ((value: DataTransfer) => void) | null = null,
  ): void {
    if (handler) this.signal[className] = { name: className, handler };
  }
}
