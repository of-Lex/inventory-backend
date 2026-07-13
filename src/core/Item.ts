import { Config } from '../config/Config.js';
import { ItemType } from '../itemTypes/ItemType.js';

Config.getInstance().registerDefault('ItemPickupRadius', 5)

export class Item {
  public static readonly pickupRadius = Config.getInstance().get('ItemPickupRadius');

  public readonly id: number;
  public readonly type: ItemType;
  private amount: number;
  private _isBlocked: boolean = false;

  constructor(id: number, type: ItemType, amount: number = 1) {
    this.id = id;
    this.type = type;
    this.amount = amount;
  }

  getAmount(): number {
    return this.amount;
  }

  addAmount(value: number): void {
    this.amount += Math.max(0, value);
  }

  isBlocked(): boolean {
    return this._isBlocked;
  }

  setBlocked(pickupBlocked: boolean): void {
    this._isBlocked = pickupBlocked;
  }
}