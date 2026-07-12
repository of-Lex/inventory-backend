import { Player } from "../core/Player.js";

export interface EffectType {
  readonly id: string;
  readonly name: string;

  getTicksCount(): number;
  onTick?(players: Map<number, Player>): void;
}