/** @import { Constructor } from '../../type/index.js' */

import { World } from '../../ecs/index.js'
import { ArrayInfo, Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { Assets, Handle } from '../core/index.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { AssetServer } from '../resources/index.js'
import { AssetLoadFail } from '../events/index.js'

/**
 * @template T
 * @param {Constructor<T>} asset
 * @returns {import('../../ecs/index.js').SystemFunc}
 */
export function registerAssetTypes(asset) {
  return function registerAssetTypes(world) {
    const registry = world.getResource(TypeRegistry)

    registry.registerTypeId(typeidGeneric(Handle, [asset]), new StructInfo({
      type: new Field(typeid(Function)),
      index: new Field(typeid(Number)),
      generation: new Field(typeid(Number))
    }))
    registry.registerTypeId(
      typeidGeneric(Assets, [asset]),
      new StructInfo({
        type: new Field(typeid(Function))
      })
    )
  }
}

/**
 * @param {World} world
 */
export function registerAssetServerTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const assetLoadFailArrayId = typeidGeneric(Array, [AssetLoadFail])

  registry.registerTypeId(assetLoadFailArrayId, new ArrayInfo(typeid(AssetLoadFail)))

  registry.register(AssetServer, new StructInfo({
    failed: new Field(assetLoadFailArrayId)
  }))
}
