import { Item } from '../../core/Item.js';
import { Player } from '../../core/Player.js';
import { World } from '../../core/World.js';
import { ItemType } from './../ItemType.js';

export class Medkit implements ItemType {
  readonly id = 'medkit';
  readonly name = 'Аптечка';
  readonly maxStack = 1;

  onUse(world: World, player: Player, item: Item): boolean {
    const playerMaxHealth = Player.maxHealth;
    player.setHealth(playerMaxHealth);
    return true;
  }
}