import { Handle } from '../../asset/index.js'
import { Mesh } from '../assets/index.js'

export class Meshed {

  /**
   * @type {Handle<Mesh>} 
   */
  handle

  /**
   * @param {Handle<Mesh>} handle 
   */
  constructor(handle) {
    this.handle = handle
  }
}