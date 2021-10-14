const debug = require("debug")("sssr:worker");
const puppeteer = require("puppeteer");
const uselessTypes = require("./interceptors/useless-types");
const uselessResources = require("./interceptors/useless-resources");

class Worker {
  /**
   * @returns {Promise<Worker>}
   */
  static initWorker() {
    return new Worker().init();
  }

  /**
   * @returns {Promise<Worker>}
   */
  async init() {
    this.browser = await this.initBrowser();

    debug({
      version: await this.browser.version(),
      pid: this.browser.process().pid,
    });

    return this;
  }

  /**
   * @param {function} pageOptionsFunction
   * @returns {Promise<*>}
   */
  async process(pageOptionsFunction) {
    let content = "";

    let page = null;

    return new Promise(async (resolve, reject) => {
      page = await this.browser.newPage();

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (uselessTypes(request) || uselessResources(request)) {
          return request.abort();
        }

        request.continue();
      });

      try {
        await pageOptionsFunction(page);

        content = await page.content();
      } catch (e) {
        return reject(e);
      }

      return resolve(content);
    })
      .catch((e) => {
        debug(e.message);

        return Promise.reject(e.message);
      })
      .finally(async () => {
        await page.close();
      });
  }

  /**
   * @returns {Promise<Browser>}
   */
  async initBrowser() {
    if (process.env.JEST_WORKER_ID) {
      return Promise.resolve();
    }

    return puppeteer.launch({
      args: [
        "--no-sandbox",
        "--headless",
        "--disable-gpu",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--allow-insecure-localhost",
      ],
      ignoreHTTPSErrors: true,
      executablePath: process.env.CHROME_BIN || null,
    });
  }
}

module.exports = Worker;
