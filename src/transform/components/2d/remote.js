import { Entity } from '../../../ecs/index.js'
import { Affine2 } from '../../../math/index.js'

export class RemoteTransform2D {

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
   * @type {Affine2}
   */
  offsetTransform = new Affine2()

  /**
   * @param {Entity} entity
   */
  constructor(entity) {
    this.entity = entity
  }

  /**
   * @param {RemoteTransform2D} source
   * @param {RemoteTransform2D} target
   */
  static copy(source, target = new RemoteTransform2D(source.entity)) {
    target.copyTranslation = source.copyTranslation
    target.copyOrientation = source.copyOrientation
    target.copyScale = source.copyScale
    target.entity = source.entity
    target.offsetTransform = Affine2.copy(source.offsetTransform, new Affine2())

    return target
  }

  /**
   * @param {RemoteTransform2D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
