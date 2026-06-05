import { BasicMaterial } from '../../assets/index.js'
import { Material2D, Material3D } from '../material.js'
import { HandleSnapshot } from '../../../asset/index.js'

/**
 * @augments Material2D<BasicMaterial>
 */
export class BasicMaterial2D extends Material2D {

  /**
   * @param {BasicMaterial2D} source
   * @param {BasicMaterial2D} target
   */
  static copy(source, target = new BasicMaterial2D(source.handle)) {
    target.handle = source.handle.clone()

    return target
  }

  /**
   * @param {BasicMaterial2D} target
   */
  static clone(target) {
    return BasicMaterial2D.copy(target)
  }

  /**
   * @param {import('../../../ecs/index.js').World} world
   * @returns {BasicMaterial2DSnapshot}
   */
  toSnapshot(world) {
    return new BasicMaterial2DSnapshot(this.handle.toSnapshot(world))
  }
}

/**
 * @augments Material3D<BasicMaterial>
 */
export class BasicMaterial3D extends Material3D {

  /**
   * @param {BasicMaterial3D} source
   * @param {BasicMaterial3D} target
   */
  static copy(source, target = new BasicMaterial3D(source.handle)) {
    target.handle = source.handle.clone()

    return target
  }

  /**
   * @param {BasicMaterial3D} target
   */
  static clone(target) {
    return BasicMaterial3D.copy(target)
  }

  /**
   * @param {import('../../../ecs/index.js').World} world
   * @returns {BasicMaterial3DSnapshot}
   */
  toSnapshot(world) {
    return new BasicMaterial3DSnapshot(this.handle.toSnapshot(world))
  }
}

/**
 * Snapshot of a 2D basic material component.
 */
export class BasicMaterial2DSnapshot {

  /**
   * @type {HandleSnapshot<BasicMaterial>}
   */
  handle

  /**
   * @param {HandleSnapshot<BasicMaterial>} handle
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * @param {import('../../../ecs/index.js').World} world
   * @returns {BasicMaterial2D}
   */
  fromSnapshot(world) {
    return new BasicMaterial2D(this.handle.fromSnapshot(world))
  }
}

/**
 * Snapshot of a 3D basic material component.
 */
export class BasicMaterial3DSnapshot {

  /**
   * @type {HandleSnapshot<BasicMaterial>}
   */
  handle

  /**
   * @param {HandleSnapshot<BasicMaterial>} handle
   */
  constructor(handle) {
    this.handle = handle
  }

  /**
   * @param {import('../../../ecs/index.js').World} world
   * @returns {BasicMaterial3D}
   */
  fromSnapshot(world) {
    return new BasicMaterial3D(this.handle.fromSnapshot(world))
  }
}
