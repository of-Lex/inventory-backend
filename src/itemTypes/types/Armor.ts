import { Player } from '../../core/Player.js';
import { World } from '../../core/World.js';
import { ItemType } from './../ItemType.js';

export class Armor implements ItemType {
  readonly id = 'armor';
  readonly name = 'Бронежилет';
  readonly maxStack = 1;

  onUse(world: World, player: Player): boolean {
    player.setArmor(100);
    return true;
  }
}