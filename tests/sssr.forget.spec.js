const SSSR = require("../lib/sssr");
const Content = require("./../lib/content");

const GOOGLE = "https://google.com/";
const FACEBOOK = "https://facebook.com/";

const CACHED_CONTENT = "cached content";

describe("SSSR.forget()", () => {
  test("it should forget the cache:forget(url))", async () => {
    const sssr = new SSSR(1);

    await sssr.cache.set(GOOGLE, CACHED_CONTENT);

    const result = await sssr.forget(GOOGLE);

    expect(result).toBeInstanceOf(Content);
    expect(result.status).toBe(202);
    expect(result.content).toBe("");
    expect(await sssr.cache.get(GOOGLE)).toBeUndefined();
  });

  test("it should forget all the cache:forget(*))", async () => {
    const sssr = new SSSR(1);

    await sssr.cache.set(GOOGLE, CACHED_CONTENT);
    await sssr.cache.set(FACEBOOK, CACHED_CONTENT);

    const result = await sssr.forget("*");

    expect(result).toBeInstanceOf(Content);
    expect(result.status).toBe(202);
    expect(result.content).toBe("");
    expect(await sssr.cache.get(GOOGLE)).toBeUndefined();
    expect(await sssr.cache.get(FACEBOOK)).toBeUndefined();
  });

  test("it should work with empty cache:forget(url))", async () => {
    const sssr = new SSSR(1);

    const result = await sssr.forget(GOOGLE);

    expect(result).toBeInstanceOf(Content);
    expect(result.status).toBe(202);
    expect(result.content).toBe("");
  });
});
