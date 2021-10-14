const useful = ["document", "script", "xhr", "fetch"];

/**
 * @param {Object} request
 * @returns {boolean}
 */
module.exports = function (request) {
  if (!~useful.indexOf(request.resourceType())) {
    return true;
  }
};
