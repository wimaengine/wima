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
}