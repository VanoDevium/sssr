const DefaultForbiddenHeaders = new Set(["host", "user-agent"]);

/**
 * @param {Object} object
 * @param {Array?} forbiddenHeaders
 * @returns {Object}
 */
const filterHeaders = (object, forbiddenHeaders) => {
  if (typeof object !== "object") {
    return {};
  }

  const forbiddenKeysSet = Array.isArray(forbiddenHeaders)
    ? new Set(forbiddenHeaders)
    : DefaultForbiddenHeaders;

  forbiddenKeysSet.forEach((key) => {
    delete object[key];
  });

  return object;
};

module.exports = filterHeaders;
