import { Config } from '../config/Config.js';
import { ItemType } from '../itemTypes/ItemType.js';

Config.getInstance().registerDefault('ItemPickupRadius', 5)

export class Item {
  public readonly id: number;
  public readonly type: ItemType;
  public amount: number;

  constructor(id: number, type: ItemType, amount: number = 1) {
    this.id = id;
    this.type = type;
    this.amount = amount;
  }
}