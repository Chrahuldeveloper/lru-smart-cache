import checkMemory = require("./memoryCheck");

class SmartLru {
  private baseMax: number;
  private dynamic: boolean;
  private checkInterval: number;
  private cache: Map<any, any>;
  private arr: Map<any, any>[];
  private keyIndex: any;

  constructor(
    baseMax: number = 500,
    dynamic: boolean = true,
    checkInterval: number = 5000
  ) {
    this.baseMax = baseMax;
    this.dynamic = dynamic;
    this.checkInterval = checkInterval;
    this.cache = new Map();
    this.arr = [this.cache];

    if (this.dynamic) {
      setInterval(() => {
        this.removeLruCache(this.keyIndex);
      }, this.checkInterval);
    }
  }

  setCache(key: any, value: any) {
    this.cache.set(key, value);
  }

  hasCache(key: any) {
    return this.cache.has(key);
  }

  getCache(key: any) {
    if (this.hasCache(key)) {
      if (this.dynamic) {
        // for async behaviour
        setTimeout(() => {
          const KeyIndex = this.arr.findIndex((el: any) => el[0] === key);
          this.keyIndex = KeyIndex;
          if (KeyIndex !== -1) {
            const [elem] = this.arr.splice(KeyIndex, 1);
            this.arr.unshift(elem);
          }
        }, 0);
      }
      return this.cache.get(key);
    } else {
      throw new Error("Cache not avaliable");
    }
  }

  deleteCache(key: any) {
    if (this.hasCache(key)) {
      this.cache.delete(key);
    } else {
      throw new Error("Cache not avaliable");
    }
  }

  removeLruCache(key: any) {
    const result = checkMemory({ BaseMax: this.baseMax });
    console.log(result);
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else {
      throw new Error("Cache not avaliable");
    }
  }
}
