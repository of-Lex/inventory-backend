import { EffectType } from './EffectType.js';
import { BandageEffect } from './types/BandageEffect.js';
import { FlareEffect } from './types/FlareEffect.js';

export const ALL_EFFECT_TYPES: EffectType[] = [
  new BandageEffect(),
  new FlareEffect()
];