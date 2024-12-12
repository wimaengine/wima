/**
 * @type {Map<string,EntityMapper<unknown>>}
 */
export class SceneComponentMapper extends Map {}

/**
 * Resource used to spawn scenes into the world.
 */
export class SceneSpawner {
  /**
   * @type {Map<Handle<Scene>,Entity[]>}
   */
  map = new Map()
  add(handle, entity) {
    const id = handle.handle
    if (!this.map.has(id))
      this.map.set(id, [])
    this.map.get(id).push(entity)
  }
  remove(handle, entity) {
    const id = handle.handle
    if (!this.map.has(id))
      this.map.set(id, [])
    this.map.get(id).push(entity)
  }
  
  
  clearScene(handle) {
    this.map.delete(handle)
  }
}

/**
 * @callback SceneSpawnerEachFunc
 * @param {Handle<Scene>} handle
 * @param {Entity} entity
 */