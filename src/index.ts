import checkMemory from "./memoryCheck";

class SmartLru {
  private baseMax: number;
  private dynamic: boolean;
  private checkInterval: number;
  private cache: Map<any, any>;
  private arr: [any, any][];

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
  }

  setCache(key: any, value: any) {
    this.cache.set(key, value);
    this.arr.unshift([key, value]);
  }

  hasCache(key: any) {
    return this.cache.has(key);
  }

  getCache(key: any) {
    if (this.hasCache(key)) {
      if (this.dynamic) {
        this.removeLruCache(key);
        const keyIndex = this.arr.findIndex((el) => el[0] === key);
        if (keyIndex !== -1) {
          const [elem] = this.arr.splice(keyIndex, 1);
          this.arr.unshift(elem);
        }
        console.log(
          "LRU Updated Order:",
          this.arr.map(([k]) => k)
        );
      }
      return this.cache.get(key);
    } else {
      throw new Error("Cache not available");
    }
  }

  deleteCache(key: any) {
    if (this.hasCache(key)) {
      this.cache.delete(key);
      const index = this.arr.findIndex(([k]) => k === key);
      if (index !== -1) this.arr.splice(index, 1);
    } else {
      throw new Error("Cache not available");
    }
  }

  removeLruCache(key: any) {
    const result = checkMemory({ BaseMax: this.baseMax });
    console.log(result);
    if (result.shrink) {
      const last = this.arr.pop();
      if (last) {
        this.cache.delete(last[0]);
        console.log(`🗑️ Removed LRU key: ${last[0]}`);
      }
    } else {
      console.log("Not shrinking cache.");
    }
  }

  dataarr() {
    return this.arr;
  }
}

export default SmartLru;

// ---------- Usage ----------
const cache = new SmartLru(500, true, 5000);

for (let i = 1; i <= 8; i++) {
  cache.setCache(`user:${i}`, { name: `User${i}` });
}

console.log(
  "Initial order:",
  cache.dataarr().map(([k]) => k)
);

cache.getCache("user:8");
cache.getCache("user:7");
cache.getCache("user:3");
