import { throws } from '../../logger/index.js'
import { Device } from '../../device/index.js'

/**
 * @abstract 
 * @template T
 */
export class Parser {

  /**
   * @param {Response} _response
   * @returns {Promise<T | undefined>}
   */
  async parse(_response) {
    throws(`Implement the method \`parse\` on \`${this.constructor.name}\``)

    return undefined
  }

  /**
   * @param {string} _extension 
   * @returns {boolean}
   */
  verify(_extension){
    throws(`Implement the method \`verify\` on \`${this.constructor.name}\``)

    return false
  }
}