/** @import { World } from '@wimaengine/ecs' */

import { abstractMethod } from '@wimaengine/utils'

/**
 * Scening interface equivalent for components that can become a scene snapshot.
 *
 * @template T
 * @interface
 */
export class ToSnapshot {

  /**
   * @param {World} _world
   * @throws {string}
   * @returns {T}
   */
  toSnapshot(_world) {
    throw abstractMethod(this, ToSnapshot, ToSnapshot.prototype.toSnapshot)
  }
}

/**
 * Scening interface equivalent for snapshots that can restore a live component.
 *
 * @template T
 * @interface
 */
export class FromSnapshot {

  /**
   * @param {World} _world
   * @throws {string}
   * @returns {T}
   */
  fromSnapshot(_world) {
    throw abstractMethod(this, FromSnapshot, FromSnapshot.prototype.fromSnapshot)
  }
}

export default {}
