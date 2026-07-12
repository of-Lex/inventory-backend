import { Player } from '../../core/Player.js';
import { World } from '../../core/World.js';
import { ItemType } from './../ItemType.js';

export class Ammo implements ItemType {
  readonly id = 'ammo';
  readonly name = 'Патроны';
  readonly maxStack = 30;

  onUse(world: World, player: Player): boolean {
    player.ammo += 30;
    return true;
  }
}