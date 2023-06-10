import fs from "node:fs/promises";
import path from "node:path";

import { exists } from "./utils";

const STORAGE_FOLDER = ".workshop";
const STORAGE_FILE = "store";

export class LocalStorage {
  private readonly storageLocation: string;

  public constructor(baseFolderPath: string) {
    this.storageLocation = path.join(
      baseFolderPath,
      STORAGE_FOLDER,
      STORAGE_FILE
    );
  }

  public get folder(): string {
    return path.dirname(this.storageLocation);
  }

  public async put(key: string, value: string): Promise<void> {
    const store = await this.load();
    store[key] = value;
    await fs.writeFile(
      this.storageLocation,
      path.basename(JSON.stringify(store))
    );
  }

  public async get(key: string): Promise<string | undefined> {
    const store = await this.load();
    return store[key];
  }

  private async load(): Promise<Record<string, string>> {
    if (await exists(this.storageLocation)) {
      const content = (await fs.readFile(this.storageLocation)).toString();
      return JSON.parse(content) as Record<string, string>;
    }
    return {};
  }
}
