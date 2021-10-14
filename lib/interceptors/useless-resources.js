const useless = [
  "google-analytics.com",
  "fonts.googleapis.com",
  "stats.g.doubleclick.net",
  "mc.yandex.ru",
  "js-agent.newrelic.com",
  "api.segment.io",
  "fast.fonts.com",
  "youtube.com/embed",
  "googleads.g.doubleclick.net",
  "pagead2.googlesyndication.com",
  "tpc.googlesyndication.com",
  "partner.googleadservices.com",
];

/**
 * @param {Object} request
 * @returns {boolean}
 */
module.exports = (request) => {
  const url = request.url();

  for (let i = 0; i < useless.length; i++) {
    if (~url.indexOf(useless[i])) {
      return true;
    }
  }
};
