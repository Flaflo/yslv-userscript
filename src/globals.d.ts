declare const browser: typeof chrome | undefined

declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[]): Promise<Record<string, any>>
      set(items: Record<string, any>): Promise<void>
      remove(keys: string | string[]): Promise<void>
    }
    const sync: StorageArea | undefined
  }
  namespace runtime {
    function getURL(path: string): string
  }
}

declare module "*.css?raw" {
  const content: string
  export default content
}

declare module "*.css?inline" {
  const content: string
  export default content
}

declare module "*.svg?icondef" {
  const def: { viewBox: string; paths: string[] }
  export default def
}
