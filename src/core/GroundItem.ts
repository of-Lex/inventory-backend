import { Config } from '../config/Config.js';
import { ItemType } from '../itemTypes/ItemType.js';
import { Position } from '../types/Position.js';
import { GameLoop } from './GameLoop.js';
import { Item } from './Item.js';
import { Tickable } from './Tickable.js';

Config.getInstance().registerDefault('GroundItemLifetime', 5000)

export class GroundItem extends Item implements Tickable {
  public static readonly lifeTime = Config.getInstance().get('GroundItemLifetime');

  private readonly position: Position;
  public readonly droppedAt: number;
  public lifeTimeLeft: number;

  constructor(id: number, typeId: ItemType, amount: number, x: number, y: number) {
    super(id, typeId, amount);
    this.position = { x, y };
    this.droppedAt = Date.now();
    this.lifeTimeLeft = GroundItem.lifeTime;
    GameLoop.getInstance().subscribe(this);
  }

  isExpired(): boolean {
    return Date.now() - this.droppedAt > GroundItem.lifeTime;
  }

  tick(deltaTime: number): void {
    // this.lifeTimeLeft = this.lifeTime - (Date.now() - this.droppedAt);
    this.lifeTimeLeft -= deltaTime;
  }

  getPosition(): Position {
    return this.position;
  }
}