const debug = require("debug")("sssr:limiter");
const genericPool = require("generic-pool");

const initWorker = require("./worker").initWorker;

class Limiter {
  /**
   * @param {number} workers
   */
  constructor(workers) {
    this.limit = Math.max(+workers, 1);

    this.pool = genericPool.createPool(
      {
        create: () => initWorker(),
        destroy: (worker) => {
          if (worker.browser) {
            return worker.browser.close();
          }

          return Promise.resolve();
        },
      },
      {
        max: this.limit,
        min: 1,
      }
    );

    debug("started");
  }

  /**
   * @param {function} task
   * @returns {Promise<*>}
   */
  async process(task) {
    return this.pool.acquire().then((worker) => {
      return worker.process(task).finally(() => {
        this.pool.release(worker);
      });
    });
  }
}

module.exports = Limiter;
