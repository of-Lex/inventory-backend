import { Position } from "../types/Position.js";

export class Utils {
  private constructor() { }
  
  static getDistance(pos1: Position, pos2: Position): number {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
  }

  static async sleep(ms: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, ms));
    return true;
  }

  static logWithTime(message: string): void {
    const currentDate = new Date()
    const time = currentDate.toLocaleTimeString();
    console.log(`[${time}.${String(currentDate.getMilliseconds()).padStart(3, '0')}] ${message}`);
  }
}