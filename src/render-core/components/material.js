import { Material } from '../assets/index.js'
import { Handle } from '../../asset/index.js'

/**
 * @abstract
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



/**
 * @template {Material} T
 * @template {Material3D<T>} U
 * @param {import("../../index.js").Constructor<U>} type
 * @returns {import('../../ecs/index.js').ComponentHook}
 */
export function dropMaterial2D(type) {
  return function dropMaterial2D(entity, world) {
    const material = world.get(entity, type)

    if (!material) {
      return
    }

    material.handle.drop()
  }
}

/**
 * @template {Material} T
 * @template {Material3D<T>} U
 * @param {import("../../index.js").Constructor<U>} type
 * @returns {import('../../ecs/index.js').ComponentHook}
 */
export function dropMaterial3D(type) {
  return function dropMaterial3D(entity, world) {
    const material = world.get(entity, type)

    if (!material) {
      return
    }

    material.handle.drop()
  }
}
