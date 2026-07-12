import { Position } from "../types/Position.js";

export class Utils {
  private constructor() { }
  
  static getDistance(pos1: Position, pos2: Position): number {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
  }
}