const SSSR = require("../lib/sssr");
const Content = require("./../lib/content");

const GOOGLE = "https://google.com/";

const CACHED_CONTENT = "cached content";
const ORIGINAL_CONTENT = "original content";

describe("SSSR.get()", () => {
  test("it should skip the cache:get(url, {}, false)", async () => {
    const sssr = new SSSR(1);

    await sssr.cache.set(GOOGLE, CACHED_CONTENT);

    sssr.limiter.process = jest.fn(() => Promise.resolve(ORIGINAL_CONTENT));

    const result = await sssr.get(GOOGLE, null, false);

    expect(result).toBeInstanceOf(Content);
    expect(result.status).toBe(200);
    expect(result.content).not.toBe(CACHED_CONTENT);
    expect(result.content).toBe(ORIGINAL_CONTENT);
  });

  test("it should skip the cache:getWithCache(url, {})", async () => {
    const sssr = new SSSR(1);

    await sssr.cache.set(GOOGLE, CACHED_CONTENT);

    sssr.limiter.process = jest.fn(() => Promise.resolve(ORIGINAL_CONTENT));

    const result = await sssr.getWithCache(GOOGLE, {});

    expect(result).toBeInstanceOf(Content);
    expect(result.status).toBe(200);
    expect(result.content).not.toBe(ORIGINAL_CONTENT);
    expect(result.content).toBe(CACHED_CONTENT);
  });

  test("it should skip the cache:getWithoutCache(url, {})", async () => {
    const sssr = new SSSR(1);

    await sssr.cache.set(GOOGLE, CACHED_CONTENT);

    sssr.limiter.process = jest.fn(() => Promise.resolve(ORIGINAL_CONTENT));

    const result = await sssr.getWithoutCache(GOOGLE, {});

    expect(result).toBeInstanceOf(Content);
    expect(result.status).toBe(200);
    expect(result.content).not.toBe(CACHED_CONTENT);
    expect(result.content).toBe(ORIGINAL_CONTENT);
  });

  test("it should put to the cache:get(url)", async () => {
    const sssr = new SSSR(1);

    sssr.limiter.process = jest.fn(() => Promise.resolve(ORIGINAL_CONTENT));

    const result = await sssr.get(GOOGLE);

    expect(result).toBeInstanceOf(Content);
    expect(result.status).toBe(200);
    expect(result.content).toBe(ORIGINAL_CONTENT);

    expect(await sssr.cache.get(GOOGLE)).toBe(ORIGINAL_CONTENT);
  });

  test("it should pass options:get(url, {...})", async () => {
    const sssr = new SSSR(1);
    const headers = { "user-agent": "curl/client" };

    sssr.limiter.process = jest
      .spyOn(sssr.limiter, "process")
      .mockImplementation(() => Promise.resolve());

    const spy = jest.spyOn(sssr, "makePageOptionsFunction");

    await sssr.get(GOOGLE, { headers });

    const options = Object.assign(SSSR.DefaultPageOptions, {
      headers,
    });

    expect(spy).toHaveBeenCalledWith(GOOGLE, options);
  });
});
