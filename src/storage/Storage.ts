import { Config } from "../config/Config.js";
import { GroundItem } from "../core/GroundItem.js";
import { Item } from "../core/Item.js";
import { Player } from "../core/Player.js";
import { Utils } from "../core/Utils.js";

Config.getInstance().registerDefault('StorageDelay', 50);

export class Storage {
  public static readonly storageDelay = Config.getInstance().get('StorageDelay');
  private static instance: Storage | null = null;

  private constructor() { }

  public static getInstance(): Storage {
    if(!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  private async storageOperation(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, Storage.storageDelay));
    return true;
  }

  public async createPlayer(player: Player): Promise<boolean> {
    await this.storageOperation();
    Utils.logWithTime(`STORAGE: Player created, id: ${player.id}`);
    return true
  }

  public async savePlayer(player: Player): Promise<void> {
    const result = await this.storageOperation();
    Utils.logWithTime(`STORAGE: Player ${player.id} saved to Storage`);
  }

  public async createItem(item: Item): Promise<boolean> {
    await this.storageOperation();
    Utils.logWithTime(`STORAGE: Item created, id: ${item.id}`);
    return true
  }

  public async deleteItem(item: Item): Promise<void> {
    await this.storageOperation();
    Utils.logWithTime(`STORAGE: Item deleted, id: ${item.id}`);
  }

  public async createGroundItem(groundItem: GroundItem): Promise<boolean> {
    await this.storageOperation();
    Utils.logWithTime(`STORAGE: Ground Item created, id: ${groundItem.id}`);
    return true
  }

  public async saveGroundItem(groundItem: GroundItem): Promise<void> {
    const result = await this.storageOperation();
    Utils.logWithTime(`STORAGE: Ground Item ${groundItem.id} saved to Storage`);
  }

  public async deleteGroundItem(groundItem: GroundItem): Promise<void> {
    await this.storageOperation();
    Utils.logWithTime(`STORAGE: Ground Item deleted, id: ${groundItem.id}`);
  }
}