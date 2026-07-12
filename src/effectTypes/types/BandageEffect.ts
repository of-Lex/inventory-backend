import { Config } from '../../config/Config.js';
import { Player } from '../../core/Player.js';
import { EffectType } from './../EffectType.js';

Config.getInstance().registerDefault('BandageEffectTicksCount', 5);
Config.getInstance().registerDefault('BandageHealPerTick', 10)

export class BandageEffect implements EffectType {
  readonly id = 'bandage';
  readonly name = 'Лечение бинтом';
  private readonly healPerTick = Config.getInstance().get('BandageHealPerTick');
  private readonly ticksCount = Config.getInstance().get('BandageEffectTicksCount');

  getTicksCount(): number {
    return this.ticksCount;
  }

  onTick(players: Map<number, Player>): void {
    for(const player of players.values()) {
      player.setHealth(player.getHealth() + this.healPerTick);
    }
  }
}