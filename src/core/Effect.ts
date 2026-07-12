import { EffectType } from '../effectTypes/EffectType.js';
import { GameLoop } from './GameLoop.js';
import { Player } from './Player.js';
import { Tickable } from './Tickable.js';

export class Effect implements Tickable {
  public players: Map<number, Player>;
  public readonly type: EffectType;
  public ticksLeft: number;

  constructor(players: Map<number, Player>, type: EffectType, ticksLeft: number) {
    this.players = players;
    this.type = type;
    this.ticksLeft = ticksLeft;
    for(const player of this.players.values()) {
      player.addEffect(this)
    }
    GameLoop.getInstance().subscribe(this);
  }

  public tick(deltaTime: number): void {
    this.ticksLeft--;

    if(this.type.onTick) {
      this.type.onTick(this.players);
    }

    if(this.ticksLeft <= 0) this.end();
  }

  public end(): void {
    for(const player of this.players.values()) {
      player.removeEffect(this);
    }
    GameLoop.getInstance().unsubscribe(this);
  }
}