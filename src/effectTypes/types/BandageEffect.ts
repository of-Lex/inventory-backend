import { Config } from '../../config/Config.js';
import { Player } from '../../core/Player.js';
import { EffectType } from './../EffectType.js';

Config.getInstance().registerDefault('BandageEffectTicksCount', 5);
Config.getInstance().registerDefault('BandageHealPerTick', 10)

export class BandageEffect implements EffectType {
  readonly id = 'bandage';
  readonly name = 'Лечение бинтом';
  readonly healPerTick = Config.getInstance().get('BandageHealPerTick');

  getTicksCount(): number {
    return Config.getInstance().get('BandageEffectTicksCount');
  }

  onTick(players: Map<number, Player>): void {
    for(const player of players.values()) {
      player.setHealth(player.getHealth() + this.healPerTick);
    }
  }
}