import { Item } from '../../core/Item.js';
import { Player } from '../../core/Player.js';
import { World } from '../../core/World.js';
import { ItemType } from '../ItemType.js';

export class Burger implements ItemType {
  readonly id = 'burger';
  readonly name = 'Бургер';
  readonly maxStack = 10;

  onUse(world: World, player: Player, item: Item): boolean {
    player.setHealth(player.getHealth() + 10);
    return true;
  }
}