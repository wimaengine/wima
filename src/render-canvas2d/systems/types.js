import { World } from '../../ecs/index.js'
import { MapInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid } from '../../type/index.js'
import { TextureCache } from '../../render-core/index.js'

/**
 * @param {World} world
 */
export function registerCanvas2DTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const htmlImageElementId = setTypeId('HTMLImageElement')

  registry.registerTypeId(htmlImageElementId, new StructInfo({}))
  registry.register(TextureCache, new MapInfo(typeid(Number), htmlImageElementId))
}
