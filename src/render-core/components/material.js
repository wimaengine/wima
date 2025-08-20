import { Material } from '../assets/index.js'
import { Handle } from '../../asset/index.js'

/**
 * @template {Material} T
 */
export class Material2D {

  /**
   * @type {Handle<T>}
   */
  handle

  /**
   * @param {Handle<T>} handle
   */
  constructor(handle) {
    this.handle = handle
  }
}

/**
 * @template {Material} T
 */
export class Material3D {

  /**
   * @type {Handle<T>}
   */
  handle

  /**
   * @param {Handle<T>} handle
   */
  constructor(handle) {
    this.handle = handle
  }
}