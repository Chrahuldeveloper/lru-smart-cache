import os from "os";

interface CheckMemoryPrameters {
  BaseMax: number;
  MemoryThresholds: number;
}

interface Result {
  shrink: boolean;
  newBaseMax: number;
}

function checkMemory({ BaseMax, MemoryThresholds }: CheckMemoryPrameters) {
  const res: Result = {
    shrink: false,
    newBaseMax: 0,
  };
  const totalMemoryBytes = os.totalmem();
  const freeMemoryBytes = os.freemem();
  const usedMemory = totalMemoryBytes - freeMemoryBytes;
  const memoryLoadPercent = (usedMemory / totalMemoryBytes) * 100;
  if (memoryLoadPercent > MemoryThresholds) {
    res.newBaseMax = Math.max(BaseMax * 0.5, 50);
    res.shrink = true;
  } else {
    res.newBaseMax = BaseMax * 1.5;
    res.shrink = false;
  }
  return res;
}

export = checkMemory;
