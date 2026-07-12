import { Config } from '../../config/Config.js';
import { Player } from '../../core/Player.js';
import { World } from '../../core/World.js';
import { ItemType } from './../ItemType.js';

Config.getInstance().registerDefault('FlareRadius', 20);

export class Flare implements ItemType {
  readonly id = 'flare';
  readonly name = 'Сигнальная граната';
  readonly maxStack = 5;

  onDrop(world: World, player: Player): boolean {
    const radius = Config.getInstance().get('FlareRadius');
    const nearPlayers = world.getPlayersNear(player.position, radius);
    world.addEffect(nearPlayers, 'flare');
    return true;
  }
}