import { Config } from '../../config/Config.js';
import { Item } from '../../core/Item.js';
import { Player } from '../../core/Player.js';
import { World } from '../../core/World.js';
import { ItemType } from './../ItemType.js';

Config.getInstance().registerDefault('FlareRadius', 20);

export class Flare implements ItemType {
  readonly id = 'flare';
  readonly name = 'Сигнальная граната';
  readonly maxStack = 5;
  private readonly radius = Config.getInstance().get('FlareRadius');

  onDrop(world: World, player: Player, item: Item): boolean {
    const nearPlayers = world.getNearPlayers(player.getPosition(), this.radius);
    world.addEffectForPlayers(nearPlayers, 'flare');
    return true;
  }
}