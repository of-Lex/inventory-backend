import { Item } from '../../core/Item.js';
import { Player } from '../../core/Player.js';
import { World } from '../../core/World.js';
import { ItemType } from './../ItemType.js';

export class Bandage implements ItemType {
  readonly id = 'bandage';
  readonly name = 'Бинт';
  readonly maxStack = 10;

  onUse(world: World, player: Player, item: Item): boolean {
    const players: Map<number, Player> = new Map();
    players.set(player.id, player);
    world.addEffect(players, 'bandage');
    return true;
  }
}