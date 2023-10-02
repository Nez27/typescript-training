import { TSignal, Data } from 'global/types';

export default class Transform {
  public signal: TSignal;

  constructor() {
    this.signal = {};
  }

  onSendSignal(fromClass: string, value: Data) {
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
    handler: ((value: Data) => void) | null = null,
  ): void {
    if (handler) this.signal[className] = { name: className, handler };
  }
}
