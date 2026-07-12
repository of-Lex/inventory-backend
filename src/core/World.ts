import { EffectType } from '../effectTypes/EffectType.js';
import { ALL_EFFECT_TYPES } from '../effectTypes/Registrator.js';
import { ItemType } from '../itemTypes/ItemType.js';
import { ALL_ITEM_TYPES } from '../itemTypes/Registrator.js';
import { Position } from '../types/Position.js';
import { Effect } from './Effect.js';
import { GameLoop } from './GameLoop.js';
import { GroundItem } from './GroundItem.js';
import { Item } from './Item.js';
import { Player } from './Player.js';
import { Tickable } from './Tickable.js';
import { Utils } from './Utils.js';

let itemAutoIncrement: number = 1

export class World implements Tickable {
  private itemTypes: Map<string, ItemType> = new Map();
  private effectTypes: Map<string, EffectType> = new Map();
  private players: Map<number, Player> = new Map();
  public groundItems: Map<number, GroundItem> = new Map();

  constructor() {
    for(const itemType of ALL_ITEM_TYPES) {
      this.registerItemType(itemType);
    }
    for(const effectType of ALL_EFFECT_TYPES) {
      this.registerEffectType(effectType);
    }
    GameLoop.getInstance().subscribe(this);
  }

  //

  registerItemType(type: ItemType): void {
    this.itemTypes.set(type.id, type);
  }

  registerEffectType(type: EffectType): void {
    this.effectTypes.set(type.id, type);
  }

  //

  addPlayer(player: Player): void {
    this.players.set(player.id, player);
  }

  getPlayer(playerId: number): Player | undefined {
    if(!this.players.has(playerId))return undefined;
    return this.players.get(playerId);
  }

  getAllPlayers(): Map<number, Player> {
    return this.players;
  }

  getNearPlayers(position: Position, radius: number): Map<number, Player> {
    const nearPlayers: Map<number, Player> = new Map();
    if(this.players.size > 0) {
      for(const player of this.players.values()) {
        const dist = Utils.getDistance(position, player.getPosition());
        if(dist <= radius) {
          nearPlayers.set(player.id, player);
        }
      }
    }
    return nearPlayers;
  }

  giveItem(playerId: number, typeId: string, amount: number = 1): boolean {
    const player = this.players.get(playerId);
    if(!player)return false;
    const itemType = this.itemTypes.get(typeId);
    if(!itemType)return false;
    while(amount > 0) {
      let findSameItem: Item | null = null;
      for(let item of player.getInventory()) {
        if(item.type.id != itemType.id)continue;
        if(item.getAmount() >= item.type.maxStack)continue;
        findSameItem = item;
        break;
      }
      if(findSameItem) {
        const realItemAmount = findSameItem.getAmount() + amount > itemType.maxStack ? itemType.maxStack - findSameItem.getAmount() : amount
        findSameItem.addAmount(realItemAmount);
        amount -= realItemAmount;
      } else {
        const realItemAmount = amount > itemType.maxStack ? itemType.maxStack : amount;
        const item = new Item(
          itemAutoIncrement++,
          itemType,
          realItemAmount
        )
        amount -= realItemAmount;
        player.addItem(item);
      }
    }
    return true;
  }

  dropItem(playerId: number, itemId: number): boolean {
    const player = this.players.get(playerId);
    if(!player)return false;

    const item = player.findItem(itemId);
    if(!item)return false;

    if(player.removeItem(itemId)) {
      const position = player.getPosition();
      const groundItem = new GroundItem(
        itemId,
        item.type,
        item.getAmount(),
        position.x,
        position.y
      );
      this.groundItems.set(groundItem.id, groundItem);
      if(item.type.onDrop) {
        item.type.onDrop(this, player, item);
      }
      return true;
    }
    return false;
  }

  pickupItem(playerId: number, groundItemId: number): boolean {
    const player = this.players.get(playerId);
    if(!player)return false;

    const groundItem = this.groundItems.get(groundItemId);
    if(!groundItem)return false;

    const dist = Utils.getDistance(player.getPosition(), groundItem.getPosition());
    if(dist > Item.pickupRadius)return false;

    if(this.groundItems.delete(groundItemId)) {
      const item = new Item(
        groundItemId,
        groundItem.type,
        groundItem.getAmount()
      );
      player.addItem(item);
      return true;
    }
    return false;
  }

  useItem(playerId: number, itemId: number): boolean {
    const player = this.players.get(playerId);
    if(!player)return false;

    const item = player.findItem(itemId);
    if(!item)return false;

    const type = this.itemTypes.get(item.type.id);
    if(!type)return false;
    if(!type.onUse)return false;

    type.onUse(this, player, item);
    player.removeItem(itemId);
    return true;
  }

  public addEffectForPlayers(players: Map<number, Player>, effectTypeId: string): Effect | null {
    const effectType = this.effectTypes.get(effectTypeId);
    if(!effectType)return null;
    return new Effect(players, effectType, effectType.getTicksCount());
  }

  public removeEffect(effect: Effect): void {
    effect.end();
  }

  //

  getAllGroundItems(): Map<number, GroundItem> {
    return this.groundItems;
  }

  getNearGroundItems(position: Position, radius: number): Map<number, GroundItem> {
    const nearGroundItems: Map<number, GroundItem> = new Map();
    if(this.groundItems.size > 0) {
      for(const groundItem of this.groundItems.values()) {
        const dist = Utils.getDistance(position, groundItem.getPosition());
        if(dist <= radius) {
          nearGroundItems.set(groundItem.id, groundItem);
        }
      }
    }
    return nearGroundItems;
  }

  //

  tick(deltaTime: number): void {
    const forRemove: number[] = [];
    for(const [id, groundItem] of this.groundItems) {
      if(groundItem.isExpired()) {
        forRemove.push(id);
      }
    }
    for(const id of forRemove) {
      if(this.groundItems.has(id)) {
        this.groundItems.delete(id);
      }
    }
  }
}