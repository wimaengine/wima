import { Affine3 } from '../../../math/index.js'
import { Entity } from '../../../ecs/index.js'

export class RemoteTransform3D {

  /**
   * @type {boolean}
   */
  copyTranslation = true

  /**
   * @type {boolean}
   */
  copyOrientation = true

  /**
   * @type {boolean}
   */
  copyScale = true

  /**
   * @type {Entity}
   */
  entity

  /**
   * @type {Affine3}
   */
  offsetTransform = new Affine3()

  /**
   * @param {Entity} entity
   */
  constructor(entity) {
    this.entity = entity
  }

  /**
   * @param {RemoteTransform3D} source
   * @param {RemoteTransform3D} target
   */
  static copy(source, target = new RemoteTransform3D(source.entity)) {
    target.copyTranslation = source.copyTranslation
    target.copyOrientation = source.copyOrientation
    target.copyScale = source.copyScale
    target.entity = source.entity
    target.offsetTransform = Affine3.copy(source.offsetTransform, new Affine3())

    return target
  }

  /**
   * @param {RemoteTransform3D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
