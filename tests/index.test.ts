import SmartLru from "../src/index";
import checkMemory from "../src/memoryCheck";

jest.mock("../src/memoryCheck");

const mockedCheckMemory = checkMemory as jest.MockedFunction<
  typeof checkMemory
>;

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  (console.log as jest.Mock).mockRestore();
});

describe("SmartLru", () => {
  let lru: SmartLru;
// clear timers 
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (lru) {
      lru.stopInterval();
    }
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("should set and get cache values correctly", () => {
    lru = new SmartLru(3, false);
    lru.setCache("a", 1);
    lru.setCache("b", 2);

    expect(lru.getCache("a")).toBe(1);
    expect(lru.getCache("b")).toBe(2);
    expect(lru.dataarr().map(([k]) => k)).toEqual(["b", "a"]);
  });

  test("should throw error when getting missing key", () => {
    lru = new SmartLru();
    expect(() => lru.getCache("missing")).toThrow("Cache not available");
  });

  test("should update LRU order when dynamic is true", () => {
    lru = new SmartLru(3, true, 5000);
    mockedCheckMemory.mockReturnValue({ shrink: false, newBaseMax: 500 });

    lru.setCache("a", 1);
    lru.setCache("b", 2);
    lru.setCache("c", 3);

    lru.getCache("a");
    expect(lru.dataarr().map(([k]) => k)).toEqual(["a", "c", "b"]);
  });

  test("should delete cache entries correctly", () => {
    lru = new SmartLru();
    lru.setCache("x", 10);
    lru.setCache("y", 20);

    lru.deleteCache("x");
    expect(lru.hasCache("x")).toBe(false);
    expect(lru.dataarr().map(([k]) => k)).toEqual(["y"]);
  });

  test("should throw error when deleting non-existent key", () => {
    lru = new SmartLru();
    expect(() => lru.deleteCache("z")).toThrow("Cache not available");
  });

  test("should remove least recently used when shrink = true", () => {
    lru = new SmartLru(2, true, 5000);
    mockedCheckMemory.mockReturnValue({ shrink: true, newBaseMax: 500 });

    lru.setCache("a", 1);
    lru.setCache("b", 2);
    lru.setCache("c", 3);

    jest.advanceTimersByTime(5000);
    expect(mockedCheckMemory).toHaveBeenCalled();
  });

  test("interval should trigger removeLruCache automatically", () => {
    lru = new SmartLru(2, true, 5000);
    mockedCheckMemory.mockReturnValue({ shrink: false, newBaseMax: 500 });

    jest.advanceTimersByTime(5000);
    expect(mockedCheckMemory).toHaveBeenCalled();
  });
});
