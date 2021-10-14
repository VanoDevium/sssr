/**
 * @param {string} content
 * @returns {string}
 */
module.exports = (content) => {
  if (!content) {
    return content;
  }

  let matches = content.match(/<script(?:.*?)>(?:[\S\s]*?)<\/script>/gi);

  for (let i = 0; matches && i < matches.length; i++) {
    if (matches[i].indexOf("application/ld+json") === -1) {
      content = content.replace(matches[i], "");
    }
  }

  //<link rel="import" src=""> tags can contain script tags. Since they are already rendered, let's remove them
  matches = content.match(/<link[^>]+?rel="import"[^>]*?>/i);
  for (let i = 0; matches && i < matches.length; i++) {
    content = content.replace(matches[i], "");
  }

  return content;
};
