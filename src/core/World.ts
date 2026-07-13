import { EffectType } from '../effectTypes/EffectType.js';
import { ALL_EFFECT_TYPES } from '../effectTypes/Registrator.js';
import { ItemType } from '../itemTypes/ItemType.js';
import { ALL_ITEM_TYPES } from '../itemTypes/Registrator.js';
import { Storage } from '../storage/Storage.js';
import { Position } from '../types/Position.js';
import { Effect } from './Effect.js';
import { GameLoop } from './GameLoop.js';
import { GroundItem } from './GroundItem.js';
import { Item } from './Item.js';
import { Player } from './Player.js';
import { Tickable } from './Tickable.js';
import { Utils } from './Utils.js';

export class World implements Tickable {
  private static playerAutoIncrement: number = 1;
  private static itemAutoIncrement: number = 1;

  private storage: Storage;
  private itemTypes: Map<string, ItemType> = new Map();
  private effectTypes: Map<string, EffectType> = new Map();
  private players: Map<number, Player> = new Map();
  public groundItems: Map<number, GroundItem> = new Map();

  constructor(storage: Storage) {
    this.storage = storage;
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

  async createPlayer(name: string, position: Position): Promise<boolean> {
    const player = new Player(
      World.playerAutoIncrement++,
      name,
      position
    )
    const storageResult = await this.storage.createPlayer(player);
    if(!storageResult)return false;
    this.players.set(player.id, player);
    return true;
  }

  getPlayerById(playerId: number): Player | undefined {
    if(!this.players.has(playerId))return undefined;
    return this.players.get(playerId);
  }

  getPlayerInventory(playerId: number): Item[] | undefined {
    const player = this.getPlayerById(playerId);
    if(player) return player.getInventory();
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

  async giveItem(playerId: number, typeId: string, amount: number = 1): Promise<boolean> {
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
          World.itemAutoIncrement++,
          itemType,
          realItemAmount
        )
        const storageResult = await this.storage.createItem(item);
        if(storageResult) {
          amount -= realItemAmount;
          player.addItem(item);
        }
      }
    }
    await this.storage.savePlayer(player);
    return true;
  }

  async dropItem(playerId: number, itemId: number): Promise<boolean> {
    const player = this.players.get(playerId);
    if(!player)return false;

    const item = player.findItem(itemId);
    if(!item)return false;

    const position = player.getPosition();
    const groundItem = new GroundItem(
      itemId,
      item.type,
      item.getAmount(),
      position.x,
      position.y
    );
    const storageResult = await this.storage.createGroundItem(groundItem);
    if(!storageResult)return false;
    player.removeItem(itemId);
    this.groundItems.set(groundItem.id, groundItem);
    if(item.type.onDrop) {
      item.type.onDrop(this, player, item);
    }
    await this.storage.deleteItem(groundItem);
    await this.storage.savePlayer(player);
    return true;
  }

  async pickupItem(playerId: number, groundItemId: number): Promise<boolean> {
    const player = this.players.get(playerId);
    if(!player)return false;

    const groundItem = this.groundItems.get(groundItemId);
    if(!groundItem)return false;

    const dist = Utils.getDistance(player.getPosition(), groundItem.getPosition());
    if(dist > Item.pickupRadius)return false;

    const item = new Item(
      groundItemId,
      groundItem.type,
      groundItem.getAmount()
    );
    const storageResult = await this.storage.createItem(groundItem);
    if(!storageResult)return false;
    this.groundItems.delete(groundItemId);
    player.addItem(item);
    await this.storage.deleteGroundItem(groundItem);
    await this.storage.savePlayer(player);
    return true;
  }

  async useItem(playerId: number, itemId: number): Promise<boolean> {
    const player = this.players.get(playerId);
    if(!player)return false;

    const item = player.findItem(itemId);
    if(!item)return false;

    const type = this.itemTypes.get(item.type.id);
    if(!type)return false;
    if(!type.onUse)return false;

    type.onUse(this, player, item);
    player.removeItem(itemId);
    await this.storage.deleteItem(item);
    await this.storage.savePlayer(player);
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

  async createGroundItem(typeId: string, position: Position, amount: number, lifeTime = GroundItem.lifeTime): Promise<boolean> {
    const itemType = this.itemTypes.get(typeId);
    if(!itemType)return false;
    if(amount > itemType.maxStack)return false;
    const groundItem = new GroundItem(
      World.itemAutoIncrement++,
      itemType,
      amount,
      position.x,
      position.y,
      lifeTime
    )
    const storageResult = await this.storage.createGroundItem(groundItem);
    if(!storageResult)return false;
    this.groundItems.set(groundItem.id, groundItem);
    return true;
  }

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

  async tick(deltaTime: number): Promise<void> {
    const forRemove: Map<number, GroundItem> = new Map();
    for(const [id, groundItem] of this.groundItems) {
      if(groundItem.isExpired()) {
        forRemove.set(id, groundItem);
      }
    }
    for(const groundItem of forRemove.values()) {
      await this.storage.deleteGroundItem(groundItem);
      this.groundItems.delete(groundItem.id);
    }
  }
}