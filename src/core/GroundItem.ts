import { Config } from '../config/Config.js';
import { ItemType } from '../itemTypes/ItemType.js';
import { Position } from '../utils/Position.js';
import { GameLoop } from './GameLoop.js';
import { Item } from './Item.js';
import { Tickable } from './Tickable.js';

Config.getInstance().registerDefault('GroundItemLifetime', 5000)

export class GroundItem extends Item implements Tickable {
  private readonly position: Position;
  public readonly droppedAt: number;
  public readonly lifeTime: number;
  public lifeTimeLeft: number;

  constructor(id: number, typeId: ItemType, amount: number, x: number, y: number) {
    super(id, typeId, amount);
    this.position = { x, y };
    this.droppedAt = Date.now();
    this.lifeTime = Config.getInstance().get('GroundItemLifetime')
    this.lifeTimeLeft = this.lifeTime;
    GameLoop.getInstance().subscribe(this);
  }

  isExpired(): boolean {
    return Date.now() - this.droppedAt > this.lifeTime;
  }

  tick(deltaTime: number): void {
    // this.lifeTimeLeft = this.lifeTime - (Date.now() - this.droppedAt);
    this.lifeTimeLeft -= deltaTime;
  }

  getPosition(): Position {
    return this.position;
  }
}