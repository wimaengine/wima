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
}