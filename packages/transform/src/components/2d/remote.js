import { EntityHandle } from '@wimaengine/ecs'
import { Affine2 } from '@wimaengine/math'

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
   * @type {EntityHandle}
   */
  entity

  /**
   * @type {Affine2}
   */
  offsetTransform = new Affine2()

  /**
   * @param {EntityHandle} entity
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
    return RemoteTransform2D.copy(target)
  }

  /**
   * @param {RemoteTransform2D} value
   */
  static serialize(value) {
    return {
      copyTranslation: value.copyTranslation,
      copyOrientation: value.copyOrientation,
      copyScale: value.copyScale,
      entity: EntityHandle.serialize(value.entity),
      offsetTransform: Affine2.serialize(value.offsetTransform)
    }
  }

  /**
   * @param {unknown} value
   * @returns {value is RemoteTransform2DSerial}
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
      Affine2.validateSerial(value.offsetTransform)
  }

  /**
   * @param {RemoteTransform2DSerial} value
   * @param {RemoteTransform2D} [out]
   */
  static deserialize(value, out = new RemoteTransform2D(new EntityHandle(0, 0))) {
    out.copyTranslation = value.copyTranslation
    out.copyOrientation = value.copyOrientation
    out.copyScale = value.copyScale
    out.entity = EntityHandle.deserialize(value.entity, out.entity)
    out.offsetTransform = Affine2.deserialize(value.offsetTransform, out.offsetTransform)

    return out
  }
}

/**
 * Serialized form of `RemoteTransform2D`.
 *
 * @typedef RemoteTransform2DSerial
 * @property {boolean} copyTranslation
 * @property {boolean} copyOrientation
 * @property {boolean} copyScale
 * @property {any} entity
 * @property {any} offsetTransform
 */
