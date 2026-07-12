import { ItemType } from "./ItemType.js";
import { Ammo } from "./types/Ammo.js";
import { Armor } from "./types/Armor.js";
import { Bandage } from "./types/Bandage.js";
import { Flare } from "./types/Flare.js";
import { Medkit } from "./types/Medkit.js";

export const ALL_ITEM_TYPES: ItemType[] = [
  new Medkit(),
  new Armor(),
  new Bandage(),
  new Ammo(),
  new Flare()
];