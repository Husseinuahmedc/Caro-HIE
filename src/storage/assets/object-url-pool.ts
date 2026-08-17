import type { StoredAssetRecord } from "../indexed-db/database";

export class AssetObjectUrlPool {
  #urls = new Map<string, string>();

  replace(records: StoredAssetRecord[]): ReadonlyMap<string, string> {
    this.dispose();
    for (const record of records) this.#urls.set(record.id, URL.createObjectURL(record.blob));
    return this.#urls;
  }

  dispose(): void {
    for (const url of this.#urls.values()) URL.revokeObjectURL(url);
    this.#urls.clear();
  }
}
