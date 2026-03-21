export interface StorageProvider {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
}

export type DescStoreEntry = {
  t: number // timestamp
  d: string // description text
}

export type DescStoreObject = Record<string, DescStoreEntry>
