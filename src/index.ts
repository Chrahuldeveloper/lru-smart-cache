import checkMemory from "./memoryCheck";

class SmartLru {
  private intervalId?: NodeJS.Timeout;
  private baseMax: number;
  private dynamic: boolean;
  private checkInterval: number;
  private cache: Map<any, any>;
  private arr: [any, any][];
  private stopped = false;

  constructor(
    baseMax: number = 500,
    dynamic: boolean = true,
    checkInterval: number = 5000
  ) {
    this.baseMax = baseMax;
    this.dynamic = dynamic;
    this.checkInterval = checkInterval;
    this.cache = new Map();
    this.arr = [];

    if (this.dynamic) {
      this.intervalId = setInterval(() => {
        if (this.stopped) return;
        this.removeLruCache();
      }, this.checkInterval);
    }
  }

  stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.stopped = true;
  }

  setCache(key: any, value: any) {
    if (this.cache.has(key)) {
      const index = this.arr.findIndex(([k]) => k === key);
      if (index !== -1) this.arr.splice(index, 1);
    }
    this.cache.set(key, value);
    this.arr.unshift([key, value]);

    if (this.arr.length > this.baseMax) {
      const last = this.arr.pop();
      if (last) this.cache.delete(last[0]);
    }
  }

  hasCache(key: any) {
    return this.cache.has(key);
  }

  getCache(key: any) {
    if (!this.hasCache(key)) {
      throw new Error("Cache not available");
    }

    const value = this.cache.get(key);

    const keyIndex = this.arr.findIndex(([k]) => k === key);
    if (keyIndex !== -1) {
      const [elem] = this.arr.splice(keyIndex, 1);
      this.arr.unshift(elem);
    }

    if (this.dynamic) {
      console.log(
        "LRU Updated Order:",
        this.arr.map(([k]) => k)
      );
    }

    return value;
  }

  deleteCache(key: any) {
    if (!this.hasCache(key)) {
      throw new Error("Cache not available");
    }

    this.cache.delete(key);
    const index = this.arr.findIndex(([k]) => k === key);
    if (index !== -1) this.arr.splice(index, 1);
  }

  removeLruCache() {
    if (this.stopped) return;

    try {
      const result = checkMemory({ BaseMax: this.baseMax });

      if (result?.shrink) {
        const last = this.arr.pop();
        if (last) {
          this.cache.delete(last[0]);
          console.log(`Removed LRU key: ${last[0]}`);
        }
      } else {
        console.log("Not shrinking cache.");
      }
    } catch (error) {
      if (!this.stopped) console.log(error);
    }
  }

  dataarr() {
    return this.arr;
  }
}

export default SmartLru;
