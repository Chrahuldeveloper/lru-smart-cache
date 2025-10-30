# SmartLru Cache

A **memory-aware LRU (Least Recently Used) cache** for Node.js that automatically adjusts its size based on system memory usage. Ideal for memory-constrained environments like AWS Lambda or VPS servers.

---

## Features

- **Automatic memory monitoring** using Node.js `os` module.
- **Dynamic cache resizing** based on system memory load.
- **LRU eviction**: least recently used items are removed first when cache exceeds memory limits.
- TypeScript support for **strict typing**.
- Easy to integrate into any Node.js application.

## Installation

````bash
npm install lru-smart-cache


## Usage / Implementation

```ts
import SmartLru from "lru-smart-cache";

// Create a new SmartLru instance
// baseMax: maximum cache size (default 500)
// dynamic: enable memory-aware resizing (default true)
// checkInterval: memory check interval in ms (default 5000)
const cache = new SmartLru(500, true, 5000);

// Add items to the cache
cache.setCache("user_1", { name: "Rahul", age: 25 });
cache.setCache("user_2", { name: "Anita", age: 30 });

// Retrieve items from the cache
try {
  const user1 = cache.getCache("user_1");
  console.log(user1); // { name: "Rahul", age: 25 }
} catch (err) {
  console.error(err.message);
}

// Check if a key exists
console.log(cache.hasCache("user_2")); // true

// Delete a key
cache.deleteCache("user_2");

// View current cache order (most recent first)
console.log(cache.dataarr());

// Stop automatic memory monitoring (optional)
cache.stopInterval();
````
