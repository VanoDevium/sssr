const SSSR = require("../lib/sssr");
const KeyValue = require("keyv");
const { default: KeyValueFile } = require("keyv-file");

describe("SSSR.constructor", () => {
  test("should have null cache", async () => {
    const sssr = new SSSR(1, false);
    expect(sssr.cache.store).toBeNull();
  });

  test("should have memory cache", async () => {
    const sssr = new SSSR(1, "memory");
    expect(sssr.cache.store).toBeInstanceOf(KeyValue);
    expect(sssr.cache.store.opts.store).toBeInstanceOf(Map);
  });

  test("should have file cache", async () => {
    const sssr = new SSSR(1, __filename);
    expect(sssr.cache.store).toBeInstanceOf(KeyValue);
    expect(sssr.cache.store.opts.store).toBeInstanceOf(KeyValueFile);
    expect(sssr.cache.store.opts.store._opts.filename).toBe(__filename);
  });

  test("should have environment cache", async () => {
    const sssr = new SSSR(1);
    expect(sssr.cache.store).toBeInstanceOf(KeyValue);
    expect(sssr.cache.store.opts.store).toBeInstanceOf(Map);
  });

  test("should have 1 worker", async () => {
    const sssr = new SSSR(1);
    expect(sssr.limiter.pool.min).toBe(1);
    expect(sssr.limiter.pool.max).toBe(1);
  });

  test("should have min 1 worker anyway", async () => {
    const sssr = new SSSR(0);
    expect(sssr.limiter.pool.min).toBe(1);
    expect(sssr.limiter.pool.max).toBe(1);
  });

  test("should have min 1 worker anyway", async () => {
    const sssr = new SSSR(undefined);
    expect(sssr.limiter.pool.min).toBe(1);
    expect(sssr.limiter.pool.max).toBe(1);
  });

  test("should have 3 workers", async () => {
    const sssr = new SSSR(3);
    expect(sssr.limiter.pool.min).toBe(1);
    expect(sssr.limiter.pool.max).toBe(3);
  });
});
