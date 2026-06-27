import { Material } from '../assets/index.js'
import { Handle } from '../../asset/index.js'

/**
 * @abstract
 * @template {Material} T
 */
export class MaterialInstance {

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
 * @param {import("../../index.js").Constructor<MaterialInstance<T>>} type
 * @returns {import('../../ecs/index.js').ComponentHook}
 */
export function dropMaterialInstance(type) {
  return function dropMaterialInstance(entity, world) {
    const material = world.get(entity, type)

    if (!material) {
      return
    }

    material.handle.drop()
  }
}
