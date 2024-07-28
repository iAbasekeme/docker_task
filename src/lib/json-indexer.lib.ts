import fs from 'fs';

interface IndexEntry {
  [key: string]: number[];
}

interface Index {
  [key: string]: IndexEntry;
}

export class JSONIndexer {
  private index: Index = {};
  private jsonFilePath: string;

  constructor(jsonFilePath: string) {
    this.jsonFilePath = jsonFilePath;
  }

  /**
   * Build the index for the JSON file.
   */
  buildIndex(): void {
    const jsonData = JSON.parse(fs.readFileSync(this.jsonFilePath, 'utf-8'));
    this.indexJSON(jsonData, 0);
    console.log('Index built successfully.');
  }

  /**
   * Search for a specific value in the index.
   * @param key The key to search for.
   * @param value The value to search for.
   * @returns An array of object locations where the value was found.
   */
  search(key: string, value: string): number[] {
    if (this.index[key]?.[value]) {
      return this.index[key][value];
    }
    return [];
  }

  /**
   * Recursively index the JSON data.
   * @param data The JSON data to index.
   * @param offset The current offset in the JSON file.
   */
  private indexJSON(data: any, offset: number): void {
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        this.indexJSON(item, offset + index * JSON.stringify(item).length);
      });
    } else if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach((key) => {
        this.indexKey(key, data[key], offset);
        this.indexJSON(data[key], offset);
      });
    }
  }

  /**
   * Index a specific key-value pair.
   * @param key The key to index.
   * @param value The value to index.
   * @param offset The current offset in the JSON file.
   */
  private indexKey(key: string, value: any, offset: number): void {
    if (!this.index[key]) {
      this.index[key] = {};
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      const valueStr = value.toString();
      if (!this.index[key][valueStr]) {
        this.index[key][valueStr] = [];
      }
      this.index[key][valueStr].push(offset);
    }
  }
}