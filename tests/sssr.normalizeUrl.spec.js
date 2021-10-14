const SSSR = require("../lib/sssr");

const GOOGLE = "https://google.com";

describe("SSSR.normalizeUrl()", () => {
  test("it should return normalized URL", async () => {
    const sssr = new SSSR(1);

    expect(sssr.normalizeUrl(GOOGLE)).toBe("https://google.com/");
  });

  test("it should return normalized URL with identifier", async () => {
    const sssr = new SSSR(1);

    expect(sssr.normalizeUrl(GOOGLE, true)).toBe(
      "https://google.com/?_sssr_=true"
    );
  });

  test("it should return empty string", async () => {
    const sssr = new SSSR(1);

    expect(sssr.normalizeUrl("i'm not an URL")).toBe("");
  });
});
