import { Handle, HandleSnapshot } from '@wimaengine/asset'
import { typeid } from '@wimaengine/type'
import { BasicMaterial } from '../../assets'
import { MaterialInstance } from '../material'

/**
 * @augments MaterialInstance<BasicMaterial>
 */
export class BasicMaterialInstance extends MaterialInstance {

  /**
   * @param {BasicMaterialInstance} source
   * @param {BasicMaterialInstance} target
   */
  static copy(source, target = new BasicMaterialInstance(source.handle)) {
    target.handle = source.handle.clone()

    return target
  }

  /**
   * @param {BasicMaterialInstance} target
   */
  static clone(target) {
    return BasicMaterialInstance.copy(target)
  }

  /**
   * @param {import('@wimaengine/ecs').World} world
   * @returns {BasicMaterialInstanceSnapshot}
   */
  toSnapshot(world) {
    return new BasicMaterialInstanceSnapshot(this.handle.toSnapshot(world))
  }
}

/**
 * Snapshot of a basic material instance component.
 */
export class BasicMaterialInstanceSnapshot {

  /**
   * @type {HandleSnapshot}
   */
  handle

  /**
   * @param {HandleSnapshot} handle
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * @param {import('@wimaengine/ecs').World} world
   * @param {import('@wimaengine/asset').AssetId} sceneAssetId
   * @returns {BasicMaterialInstance}
   */
  fromSnapshot(world, sceneAssetId) {
    return new BasicMaterialInstance(/** @type {Handle<BasicMaterial>} */(this.handle.fromSnapshot(world, sceneAssetId)))
  }

  /**
   * @param {BasicMaterialInstanceSnapshot} value
   */
  static serialize(value) {
    return {
      handle: HandleSnapshot.serialize(value.handle)
    }
  }

  /**
   * @param {BasicMaterialInstanceSnapshotSerial} value
   * @param {BasicMaterialInstanceSnapshot} [out]
   */
  static deserialize(value, out = new BasicMaterialInstanceSnapshot(new HandleSnapshot(typeid(Object), ''))) {
    out.handle = HandleSnapshot.deserialize(value.handle, out.handle)

    return out
  }
}

/**
 * @typedef BasicMaterialInstanceSnapshotSerial
 * @property {import('@wimaengine/asset').HandleSnapshotSerial} handle
 */
