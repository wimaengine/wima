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

  /**
   * @param {Meshed} source
   * @param {Meshed} target
   */
  static copy(source, target = new Meshed(source.handle)) {
    target.handle = source.handle.clone()

    return target
  }

  /**
   * @param {Meshed} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
