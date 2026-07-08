import { World } from '@wimaengine/ecs'
import { MapInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { TextureCache } from '@wimaengine/render-core'

/**
 * @param {World} world
 */
export function registerCanvas2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const htmlImageElementId = setTypeId('HTMLImageElement')

  registry.registerTypeId(htmlImageElementId, new StructInfo({}))
  registry.register(TextureCache, new MapInfo(typeid(Number), htmlImageElementId))
}
