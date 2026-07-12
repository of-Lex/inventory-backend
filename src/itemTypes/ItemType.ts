import { Player } from '../core/Player.js';
import { World } from '../core/World.js';

export interface ItemType {
  readonly id: string;
  readonly name: string;
  readonly maxStack: number;

  onDrop?(world: World, player: Player): boolean;
  onUse?(world: World, player: Player): boolean;
}