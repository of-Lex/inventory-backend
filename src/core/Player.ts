import { Config } from '../config/Config.js';
import { EffectType } from '../effectTypes/EffectType.js';
import { Position } from '../types/Position.js';
import { Effect } from './Effect.js';
import { Item } from './Item.js';

Config.getInstance().registerDefault('PlayerMaxHealth', 100);
Config.getInstance().registerDefault('PlayerMaxArmor', 100);

export class Player {
  public static readonly maxHealth = Config.getInstance().get('PlayerMaxHealth');
  public static readonly maxArmor = Config.getInstance().get('PlayerMaxArmor');

  public readonly id: number;
  public readonly name: string;
  private position: Position;
  private health: number = 100;
  private armor: number = 0;
  private ammo: number = 0;
  private inventory: Item[] = [];
  public effects: Map<EffectType, Effect> = new Map();

  constructor(id: number, name: string, position: Position) {
    this.id = id;
    this.name = name;
    this.position = position;
  }

  getPosition(): Position {
    return this.position;
  }

  setPosition(position: Position): void {
    this.position = position;
  }

  getHealth(): number {
    return this.health;
  }

  setHealth(value: number): void {
    this.health = Math.max(0, Math.min(Player.maxHealth, value));
  }

  getArmor(): number {
    return this.armor;
  }

  setArmor(value: number): void {
    this.armor = Math.max(0, Math.min(Player.maxArmor, value));
  }

  getAmmo(): number {
    return this.ammo;
  }

  addAmmo(value: number): void {
    this.ammo += Math.max(0, value);
  }

  getInventory(): Item[] {
    return this.inventory;
  }

  addItem(item: Item): void {
    this.inventory.push(item);
  }

  removeItem(itemId: number): void {
    const itemSlot = this.inventory.findIndex(item => item.id === itemId);
    if(itemSlot === -1)return;
    const item = this.inventory[itemSlot];
    if(!item)return;
    this.inventory.splice(itemSlot, 1);
  }

  findItem(itemId: number): Item | undefined {
    return this.inventory.find(i => i.id === itemId);
  }

  public addEffect(effect: Effect): void {
    this.effects.set(effect.type, effect);
  }

  public removeEffect(effect: Effect): void {
    this.effects.delete(effect.type);
  }

  public getEffects(): Map<EffectType, Effect> {
    return this.effects;
  }

  public hasEffect(type: EffectType): boolean {
    if(!this.effects.has(type))return false;
    return true;
  }
}