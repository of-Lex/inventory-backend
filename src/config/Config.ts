import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Utils } from '../core/Utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Config {
  private static instance: Config | null = null;
  private configData: any = { };
  private configPath: string;

  private constructor() {
    this.configPath = join(__dirname, 'config.json');
    try {
      const configJson = readFileSync(this.configPath, 'utf-8');
      const data = JSON.parse(configJson);
      for(let configName in data) {
        this.configData[configName] = data[configName]
      }
      Utils.logWithTime('Config config.json loaded');
    } catch (error) {
      Utils.logWithTime('File config.json not found. Generating default config...');
    }
  }

  public static getInstance(): Config {
    if(!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public get(configName: string): any {
    if(configName in this.configData) {
      return this.configData[configName];
    }
  }

  public registerDefault(configName: string, value: any): void {
    if(!(configName in this.configData)) {
      try {
        this.configData[configName] = value;
        const json = JSON.stringify(this.configData, null, 2);
        writeFileSync(this.configPath, json, 'utf-8');
        Utils.logWithTime(`Config registered: ${configName} = ${JSON.stringify(value)}`);
      } catch (error) {
        Utils.logWithTime(`ERROR config registering: ${configName} ${error}`);
      }
    } else {
      Utils.logWithTime(`Config loaded: ${configName} = ${JSON.stringify(value)}`);
    }
  }
}