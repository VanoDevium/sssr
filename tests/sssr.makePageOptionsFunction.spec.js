const SSSR = require("../lib/sssr");
const DefaultOptions = SSSR.DefaultPageOptions;

const GOOGLE = "https://google.com/";

const mockPageObject = () => {
  const page = {
    setUserAgent: jest.fn(() => Promise.resolve()),
    setExtraHTTPHeaders: jest.fn(() => Promise.resolve()),
    goto: jest.fn(() => Promise.resolve()),
    waitForSelector: jest.fn(() => Promise.resolve()),
  };

  const userAgentSpy = jest.spyOn(page, "setUserAgent");
  const extraHeadersSpy = jest.spyOn(page, "setExtraHTTPHeaders");
  const gotoSpy = jest.spyOn(page, "goto");
  const selectorSpy = jest.spyOn(page, "waitForSelector");

  return {
    page,
    userAgentSpy,
    extraHeadersSpy,
    gotoSpy,
    selectorSpy,
  };
};

describe("SSSR.makeRenderPageTask()", () => {
  test("it should make function with default options", async () => {
    const sssr = new SSSR(1);

    const fn = sssr.makePageOptionsFunction(GOOGLE, DefaultOptions);

    const { page, userAgentSpy, extraHeadersSpy, gotoSpy, selectorSpy } =
      mockPageObject();

    await fn(page);

    expect(userAgentSpy).not.toBeCalled();
    expect(extraHeadersSpy).toBeCalledWith({});
    expect(gotoSpy).toBeCalledWith(sssr.normalizeUrl(GOOGLE, true), {
      timeout: DefaultOptions.timeout,
      waitUntil: DefaultOptions.waitUntil,
    });
    expect(selectorSpy).toBeCalledWith("body", {
      timeout: DefaultOptions.timeout,
    });
  });

  test("it should make function with user-agent header", async () => {
    const sssr = new SSSR(1);

    const fn = sssr.makePageOptionsFunction(
      GOOGLE,
      Object.assign(DefaultOptions, {
        headers: {
          "user-agent": "user/agent/v1.0.0",
        },
      })
    );

    const { page, userAgentSpy, extraHeadersSpy } = mockPageObject();

    await fn(page);

    expect(userAgentSpy).toBeCalledWith("user/agent/v1.0.0");
    expect(extraHeadersSpy).toBeCalledWith({});
  });

  test("it should make function with userAgent option", async () => {
    const sssr = new SSSR(1);

    const fn = sssr.makePageOptionsFunction(
      GOOGLE,
      Object.assign(DefaultOptions, {
        userAgent: "user/agent/v1.0.0",
      })
    );

    const { page, userAgentSpy, extraHeadersSpy } = mockPageObject();

    await fn(page);

    expect(userAgentSpy).toBeCalledWith("user/agent/v1.0.0");
    expect(extraHeadersSpy).toBeCalledWith({});
  });

  test("it should make function with custom headers", async () => {
    const sssr = new SSSR(1);

    const fn = sssr.makePageOptionsFunction(
      GOOGLE,
      Object.assign(DefaultOptions, {
        headers: {
          "x-custom-header": "custom value",
        },
      })
    );

    const { page, extraHeadersSpy } = mockPageObject();

    await fn(page);

    expect(extraHeadersSpy).toBeCalledWith({
      "x-custom-header": "custom value",
    });
  });

  test("it should make function without custom host headers", async () => {
    const sssr = new SSSR(1);

    const fn = sssr.makePageOptionsFunction(
      GOOGLE,
      Object.assign(DefaultOptions, {
        headers: {
          "x-custom-header": "custom value",
          host: GOOGLE,
        },
      })
    );

    const { page, extraHeadersSpy } = mockPageObject();

    await fn(page);

    expect(extraHeadersSpy).toBeCalledWith({
      "x-custom-header": "custom value",
    });
  });

  test("it should make function with waitForSelector option", async () => {
    const sssr = new SSSR(1);

    const fn = sssr.makePageOptionsFunction(
      GOOGLE,
      Object.assign(DefaultOptions, {
        waitForSelector: "#element",
      })
    );

    const { page, selectorSpy } = mockPageObject();

    await fn(page);

    expect(selectorSpy).toBeCalledWith("#element", {
      timeout: DefaultOptions.timeout,
    });
  });
});
