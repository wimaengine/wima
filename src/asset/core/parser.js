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
   * @param {Device} _device 
   * @returns {boolean}
   */
  verify(_extension, _device){
    throws(`Implement the method \`verify\` on \`${this.constructor.name}\``)

    return false
  }
}