/** @import { Constructor } from '@wimaengine/type' */

import { World } from '@wimaengine/ecs'
import { ArrayInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Handle, HandleSnapshot } from '../core'
import { AssetLoadFail, AssetSaveSuccess } from '../events'
import { AssetServer, Assets, AssetsSnapshot } from '../resources'

/**
 * @template T
 * @param {Constructor<T>} asset
 * @returns {import('@wimaengine/ecs').SystemFunc}
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
    registry.registerTypeId(AssetsSnapshot.typeId(typeid(asset)), new StructInfo({
      type: new Field(typeid(String)),
      assets: new Field(typeid(Array))
    }))
    registry.register(HandleSnapshot, new StructInfo({
      type: new Field(typeid(Function)),
      asset: new Field(typeid(Object))
    }))
    registry.getByTypeId(AssetsSnapshot.typeId(typeid(asset)))?.setMethod(AssetsSnapshot.serialize)
    registry.getByTypeId(AssetsSnapshot.typeId(typeid(asset)))?.setMethod(AssetsSnapshot.deserialize)
    registry.getByTypeId(AssetsSnapshot.typeId(typeid(asset)))?.setMethod(AssetsSnapshot.patch)
    registry.getByTypeId(AssetsSnapshot.typeId(typeid(asset)))?.setMethod(AssetsSnapshot.prototype.fromSnapshot)
    registry.get(HandleSnapshot)?.setMethod(HandleSnapshot.serialize)
    registry.get(HandleSnapshot)?.setMethod(HandleSnapshot.deserialize)
    registry.get(HandleSnapshot)?.setMethod(HandleSnapshot.prototype.fromSnapshot)
    registry.getByTypeId(typeidGeneric(Assets, [asset]))?.setMethod(Assets.prototype.toSnapshot)
    registry.get(Handle)?.setMethod(Handle.prototype.toSnapshot)
  }
}

/**
 * @param {World} world
 */
export function registerAssetServerTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const assetLoadFailArrayId = typeidGeneric(Array, [AssetLoadFail])
  const assetSaveSuccessArrayId = typeidGeneric(Array, [AssetSaveSuccess])

  registry.registerTypeId(assetLoadFailArrayId, new ArrayInfo(typeid(AssetLoadFail)))
  registry.registerTypeId(assetSaveSuccessArrayId, new ArrayInfo(typeid(AssetSaveSuccess)))

  registry.register(AssetServer, new StructInfo({
    failed: new Field(assetLoadFailArrayId),
    saved: new Field(assetSaveSuccessArrayId)
  }))
}
