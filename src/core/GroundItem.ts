import { Config } from '../config/Config.js';
import { ItemType } from '../itemTypes/ItemType.js';
import { Position } from '../types/Position.js';
import { GameLoop } from './GameLoop.js';
import { Item } from './Item.js';
import { Tickable } from './Tickable.js';

Config.getInstance().registerDefault('GroundItemLifeTime', 60000)

export class GroundItem extends Item implements Tickable {
  public static readonly lifeTime = Config.getInstance().get('GroundItemLifeTime');

  private _isPickupBlocked: boolean = false;
  private readonly position: Position;
  public lifeTimeLeft: number;

  constructor(id: number, type: ItemType, amount: number, x: number, y: number, lifeTime: number = GroundItem.lifeTime) {
    super(id, type, amount);
    this.position = { x, y };
    this.lifeTimeLeft = lifeTime;
    GameLoop.getInstance().subscribe(this);
  }

  isExpired(): boolean {
    return this.lifeTimeLeft <= 0;
  }

  async tick(deltaTime: number): Promise<void> {
    this.lifeTimeLeft -= deltaTime
    if(this.lifeTimeLeft <= 0) {
      this.lifeTimeLeft = 0
    }
  }

  getPosition(): Position {
    return this.position;
  }

  isPickupBlocked(): boolean {
    return this._isPickupBlocked;
  }

  setPickupBlocked(pickupBlocked: boolean): void {
    this._isPickupBlocked = pickupBlocked;
  }
}