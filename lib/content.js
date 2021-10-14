class Content {
  /**
   * @param {number} status
   * @param {string} content
   * @param {?string} error
   */
  constructor(status, content = "", error = null) {
    this.status = status;
    this.content = content;
    this.error = error;
  }
}

module.exports = Content;
