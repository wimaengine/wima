import { Handle, HandleSnapshot } from '../../asset/index.js'
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
   * @type {HandleSnapshot<Mesh>}
   */
  handle

  /**
   * @param {HandleSnapshot<Mesh>} handle
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * @param {import('../../ecs/index.js').World} world
   * @returns {Meshed}
   */
  fromSnapshot(world) {
    return new Meshed(this.handle.fromSnapshot(world))
  }
}
