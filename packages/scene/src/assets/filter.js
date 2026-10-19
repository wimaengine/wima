/** @import { TypeId } from '@wimaengine/type' */

/**
 * Controls whether a scene filter's type ids are included or excluded.
 *
 * @readonly
 * @enum {number}
 */
export const SceneFilterMode = /** @type {const} */({
  Allow: 0,
  Deny: 1
})

/**
 * Restricts the types restored when a scene is instantiated.
 */
export class SceneFilter {

  /**
   * @type {TypeId[]}
   */
  typeIds

  /**
   * @type {number}
   */
  mode

  /**
   * @param {TypeId[]} [typeIds=[]]
   * @param {number} [mode=SceneFilterMode.Allow]
   */
  constructor(typeIds = [], mode = SceneFilterMode.Allow) {
    this.typeIds = typeIds
    this.mode = mode
  }

  /**
   * @param {TypeId} typeId
   */
  allows(typeId) {
    const contains = this.typeIds.includes(typeId)

    return this.mode === SceneFilterMode.Allow ? contains : !contains
  }
}
