require("dotenv").config();

const debug = require("debug")("sssr:cache");
const KeyValue = require("keyv");
const { default: KeyValueFile } = require("keyv-file");

class Cache {
  /**
   * @param {Object?} store
   */
  constructor(store) {
    this.store = store;
  }

  /**
   * @param {string} url
   * @returns {Promise<string>}
   */
  async get(url) {
    if (null === this.store) {
      return null;
    }

    return this.store.get(url).then((content) => {
      if (content) {
        debug(`hit found for ${url}`);
      }

      return content;
    });
  }

  /**
   * @param {string} url
   * @param {string} content
   * @returns {Promise<void>}
   */
  async set(url, content) {
    if (null === this.store) {
      return null;
    }

    return this.store.set(url, content).then(() => {
      debug(`stored ${url}`);
    });
  }

  /**
   * @returns {Promise<void>}
   */
  async clear() {
    if (null === this.store) {
      return null;
    }

    return this.store.clear();
  }

  /**
   * @param {string} url
   * @returns {Promise<void>}
   */
  async delete(url) {
    if (null === this.store || !url) {
      return null;
    }

    return this.store.delete(url);
  }
}

/**
 * @returns {Cache}
 * @constructor
 */
const NullCache = () => new Cache(null);

/**
 * @returns {Cache}
 * @constructor
 */
const MemoryCache = () => new Cache(new KeyValue({}));

/**
 * @param {string} filePath
 * @returns {Cache}
 * @constructor
 */
const FileCache = (filePath) =>
  new Cache(new KeyValue({ store: new KeyValueFile({ filename: filePath }) }));

const detectStore = () => {
  if (+process.env.NO_CACHE) {
    debug("is completely disabled");
    return null;
  }

  let config = {};

  if (process.env.CACHE_FILE) {
    config.store = new KeyValueFile({
      filename: process.env.CACHE_FILE,
    });
  }

  return new KeyValue(config);
};

/**
 * @param {"memory"|string|false} type
 * @returns {Cache}
 * @throws Error
 */
const cacheFactory = (type) => {
  if (false === type) {
    return NullCache();
  }

  if ("memory" === type) {
    return MemoryCache();
  }

  if (typeof type === "string") {
    return FileCache(type);
  }

  throw new Error("Unsupported type of cache");
};

module.exports = Cache;
module.exports.detectStore = detectStore;
module.exports.EnvironmentCache = () => new Cache(detectStore());
module.exports.NullCache = NullCache;
module.exports.MemoryCache = MemoryCache;
module.exports.FileCache = FileCache;
module.exports.cacheFactory = cacheFactory;
