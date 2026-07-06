import { Affine3 } from '../../../math/index.js'
import { EntityHandle } from '../../../ecs/index.js'

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
   * @type {EntityHandle}
   */
  entity

  /**
   * @type {Affine3}
   */
  offsetTransform = new Affine3()

  /**
   * @param {EntityHandle} entity
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
    return RemoteTransform3D.copy(target)
  }

  /**
   * @param {RemoteTransform3D} value
   */
  static serialize(value) {
    return {
      copyTranslation: value.copyTranslation,
      copyOrientation: value.copyOrientation,
      copyScale: value.copyScale,
      entity: EntityHandle.serialize(value.entity),
      offsetTransform: Affine3.serialize(value.offsetTransform)
    }
  }

  /**
   * @param {unknown} value
   * @returns {value is RemoteTransform3DSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('copyTranslation' in value) ||
      !('copyOrientation' in value) ||
      !('copyScale' in value) ||
      !('entity' in value) ||
      !('offsetTransform' in value)
    ) {
      return false
    }

    return typeof value.copyTranslation === 'boolean' &&
      typeof value.copyOrientation === 'boolean' &&
      typeof value.copyScale === 'boolean' &&
      EntityHandle.validateSerial(value.entity) &&
      Affine3.validateSerial(value.offsetTransform)
  }

  /**
   * @param {RemoteTransform3DSerial} value
   * @param {RemoteTransform3D} [out]
   */
  static deserialize(value, out = new RemoteTransform3D(new EntityHandle(0, 0))) {
    out.copyTranslation = value.copyTranslation
    out.copyOrientation = value.copyOrientation
    out.copyScale = value.copyScale
    out.entity = EntityHandle.deserialize(value.entity, out.entity)
    out.offsetTransform = Affine3.deserialize(value.offsetTransform, out.offsetTransform)

    return out
  }
}

/**
 * Serialized form of `RemoteTransform3D`.
 *
 * @typedef RemoteTransform3DSerial
 * @property {boolean} copyTranslation
 * @property {boolean} copyOrientation
 * @property {boolean} copyScale
 * @property {any} entity
 * @property {any} offsetTransform
 */
