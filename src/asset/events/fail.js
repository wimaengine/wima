export class AssetLoadFail {

  /**
   * @type {string}
   */
  url

  /**
   * @type {string}
   */
  reason

  /**
   * @param {string} url
   * @param {string} reason
   */
  constructor(url, reason){
    this.url = url
    this.reason = reason
  }
}