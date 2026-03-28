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

  /**
   * @template {Material} U
   * @param {Material2D<U>} source
   * @param {Material2D<U>} target
   */
  static copy(source, target = new this(source.handle)) {
    target.handle = source.handle.clone()

    return target
  }

  /**
   * @template {Material} U
   * @param {Material2D<U>} target
   */
  static clone(target) {
    return this.copy(target)
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

  /**
   * @template {Material} U
   * @param {Material3D<U>} source
   * @param {Material3D<U>} target
   */
  static copy(source, target = new this(source.handle)) {
    target.handle = source.handle.clone()

    return target
  }

  /**
   * @template {Material} U
   * @param {Material3D<U>} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
