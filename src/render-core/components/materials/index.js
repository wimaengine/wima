import { BasicMaterial } from '../../assets/index.js'
import { MaterialInstance } from '../material.js'
import { Handle, HandleSnapshot } from '../../../asset/index.js'
import { typeid } from '../../../type/index.js'

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
   * @param {import('../../../ecs/index.js').World} world
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
   * @param {import('../../../ecs/index.js').World} world
   * @returns {BasicMaterialInstance}
   */
  fromSnapshot(world) {
    return new BasicMaterialInstance(/** @type {Handle<BasicMaterial>} */(this.handle.fromSnapshot(world)))
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
 * @property {import('../../../asset/core/handle.js').HandleSnapshotSerial} handle
 */
