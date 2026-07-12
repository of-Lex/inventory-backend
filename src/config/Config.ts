import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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
      console.log('Config config.json loaded');
    } catch (error) {
      console.warn('File config.json not found. Generating default config...');
    }
    Config.instance = this;
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
        console.log(`Config registered: ${configName} = ${JSON.stringify(value)}`);
      } catch (error) {
        console.error(`Error config registering: ${configName} ${error}`);
      }
    } else {
      console.log(`Config loaded: ${configName} = ${JSON.stringify(value)}`);
    }
  }
}