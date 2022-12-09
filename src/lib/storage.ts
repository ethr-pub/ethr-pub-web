export default class Storage<T = any> {
  private storage = window.localStorage;
  private namespace = 'root';

  constructor(namespace: string, storage?: any) {
    if (storage) {
      this.storage = storage;
    }
    this.namespace = namespace;
  }

  public remove(key: string) {
    const k = this.realKey(key);
    this.storage.removeItem(k);
  }

  public set(val: T) {
    const k = this.namespace;
    if (val === undefined) {
      this.remove(k);
      return;
    }
    this.storage.setItem(k, this.serialize(val));
    return;
  }

  public get() {
    const k = this.namespace;
    return this.deserialize(this.storage.getItem(k));
  }

  private serialize(value: T) {
    return JSON.stringify(value);
  }

  private deserialize(value: any) {
    if (typeof value !== 'string') {
      return undefined;
    }
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      return undefined;
    }
  }

  private realKey(key: string) {
    return this.namespace + ':' + key;
  }
}
