import { Config } from '../config/Config.js';
import { Tickable } from './Tickable.js';

Config.getInstance().registerDefault('TickRate', 1);

export class GameLoop {
  public static readonly tickRate = Config.getInstance().get('TickRate');
  private static instance: GameLoop | null = null;

  private tickables: Tickable[] = [];
  private isRunning: boolean = false;
  private lastTickTime: number = 0;
  private tickCounter: number = 0;

  private constructor() {
    GameLoop.instance = this;
  }

  public static getInstance(): GameLoop {
    if(!GameLoop.instance) {
      GameLoop.instance = new GameLoop();
    }
    return GameLoop.instance;
  }

  public subscribe(tickable: Tickable): void {
    this.tickables.push(tickable);
  }

  public unsubscribe(tickable: Tickable): void {
    const index = this.tickables.indexOf(tickable);
    if(index !== -1) {
      this.tickables.splice(index, 1);
    }
  }

  public start(): void {
    if(this.isRunning)return;
    this.isRunning = true;
    this.lastTickTime = Date.now();
    console.log(`GameLoop started on ${GameLoop.tickRate}/sec tick rate`);
    this.loop();
  }

  stop(): void {
    this.isRunning = false;
    console.log('GameLoop stopped');
  }

  private loop(): void {
    if(!this.isRunning)return;

    const now = Date.now();
    const deltaTime = now - this.lastTickTime;
    this.lastTickTime = now;

    for(const tickable of this.tickables) {
      tickable.tick(deltaTime);
    }

    this.tickCounter++;

    setTimeout(() => this.loop(), 1000 / GameLoop.tickRate);
  }

  public getGurrentTick(): number {
    return this.tickCounter;
  }
}