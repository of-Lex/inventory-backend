import { Item } from '../core/Item.js';
import { Player } from '../core/Player.js';
import { World } from '../core/World.js';

export interface ItemType {
  readonly id: string;
  readonly name: string;
  readonly maxStack: number;

  onDrop?(world: World, player: Player, item: Item): boolean;
  onUse?(world: World, player: Player, item: Item): boolean;
}