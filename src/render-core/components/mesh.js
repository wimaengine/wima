/** @import { ComponentHook } from '../../ecs/index.js' */
import { Handle, HandleSnapshot } from '../../asset/index.js'
import { typeid } from '../../type/index.js'
import { Mesh } from '../assets/index.js'

export class Meshed {

  /**
   * @type {Handle<Mesh>}
   */
  handle

  /**
   * @param {Handle<Mesh>} handle
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * @param {Meshed} source
   * @param {Meshed} target
   */
  static copy(source, target = new Meshed(source.handle)) {
    target.handle = source.handle.clone()

    return target
  }

  /**
   * @param {Meshed} target
   */
  static clone(target) {
    return Meshed.copy(target)
  }

  /**
   * @param {import('../../ecs/index.js').World} world
   * @returns {MeshedSnapshot}
   */
  toSnapshot(world) {
    return new MeshedSnapshot(this.handle.toSnapshot(world))
  }
}

/**
 * Snapshot of a meshed component.
 */
export class MeshedSnapshot {

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
   * @param {import('../../ecs/index.js').World} world
   * @param {import('../../asset/index.js').AssetId} sceneAssetId
   * @returns {Meshed}
   */
  fromSnapshot(world, sceneAssetId) {
    return new Meshed(/** @type {Handle<Mesh>} */(this.handle.fromSnapshot(world, sceneAssetId)))
  }

  /**
   * @param {MeshedSnapshot} value
   */
  static serialize(value) {
    return {
      handle: HandleSnapshot.serialize(value.handle)
    }
  }

  /**
   * @param {MeshedSnapshotSerial} value
   * @param {MeshedSnapshot} [out]
   */
  static deserialize(value, out = new MeshedSnapshot(new HandleSnapshot(typeid(Object), ''))) {
    out.handle = HandleSnapshot.deserialize(value.handle, out.handle)

    return out
  }
}

/**
 * @typedef MeshedSnapshotSerial
 * @property {import('../../asset/core/handle.js').HandleSnapshotSerial} handle
 */

/**
 * @type {ComponentHook}
 */
export function removeMeshedHandle(entity, world) {
  const meshed = world.get(entity, Meshed)

  if (!meshed) {
    return
  }

  meshed.handle.drop()
}
