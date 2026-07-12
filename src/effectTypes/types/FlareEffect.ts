import { Config } from '../../config/Config.js';
import { EffectType } from './../EffectType.js';

Config.getInstance().registerDefault('FlareEffectTicksCount', 10);

export class FlareEffect implements EffectType {
  readonly id = 'flare';
  readonly name = 'Подсветка сингальной гранатой';

  getTicksCount(): number {
    return Config.getInstance().get('FlareEffectTicksCount');
  }
}