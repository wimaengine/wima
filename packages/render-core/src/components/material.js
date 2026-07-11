import { Handle } from '@wimaengine/asset'
import { Material } from '../assets'

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
 * @param {import("@wimaengine/type").Constructor<MaterialInstance<T>>} type
 * @returns {import('@wimaengine/ecs').ComponentHook}
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
