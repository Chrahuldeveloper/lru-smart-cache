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

```bash
npm install lru-smart-cache
