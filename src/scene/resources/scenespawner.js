/** @import {EntityHandle, EntityId} from '../../ecs/index.js' */
/** @import {AssetId} from '../../asset/index.js' */

/**
 * Resource used to spawn scenes into the world.
 */
export class SceneSpawner {

  /**
   * @private
   * @type {Map<AssetId,EntityId[]>}
   */
  map = new Map()

  /**
   * @param {AssetId} id
   * @param {EntityHandle} entity
   */
  add(id, entity) {
    const list = this.map.get(id)

    if (list) {
      list.push(entity.id())
    } else {
      this.map.set(id, [entity.id()])
    }
  }

  /**
   * @param {AssetId} id
   * @param {EntityHandle} entity
   */
  remove(id, entity) {
    const list = this.map.get(id)

    if (!list) return

    const index = list.indexOf(entity.id())

    if (index === -1) return

    list.splice(index, 1)
  }

  /**
   * @param {AssetId} id
   */
  clear(id) {
    this.map.delete(id)
  }

  /**
   * @param {AssetId} id
   * @returns {readonly EntityId[]}
   */
  get(id) {
    return this.map.get(id)
  }

  /**
   * @param {AssetId} id
   */
  flush(id) {
    this.clear(id)

    return id
  }

  assets() {
    return this.map.keys()
  }
}
