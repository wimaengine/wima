import { TypeInfo } from './info.js'

export class TypeEntry {

  /**
   * @readonly
   * @type {TypeInfo}
   */
  info

  /**
   * @param {TypeInfo} info
   */
  constructor(info) {
    this.info = info
  }
}