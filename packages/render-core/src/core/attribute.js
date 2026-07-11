import { GlDataType } from './gldatatype'

export class MeshAttribute {

  /**
   * @readonly
   * @type {string}
   */
  name = ''

  /**
   * @readonly
   * @type {number}
   */
  id = 0

  /**
   * @readonly
   * @type {GlDataType}
   */
  type = 0

  /**
   * @readonly
   * @type {number}
   */
  size = 0

  /**
   * @param {string} name
   * @param {number} location
   * @param {GlDataType} type
   * @param {number} size
   */
  constructor(name, location, type, size) {
    this.name = name
    this.id = location
    this.type = type
    this.size = size
  }

  /**
   * @param {MeshAttribute} value
   */
  static serialize(value) {
    return {
      name: value.name,
      id: value.id,
      type: value.type,
      size: value.size
    }
  }

  /**
   * @param {MeshAttributeSerial} value
   * @param {MeshAttribute} [out]
   */
  static deserialize(value, out = new MeshAttribute('', 0, 0, 0)) {
    const target = /** @type {any} */ (out)

    target.name = value.name
    target.id = value.id
    target.type = value.type
    target.size = value.size

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is MeshAttributeSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('name' in value) || !('id' in value) || !('type' in value) || !('size' in value)) {
      return false
    }

    return typeof value.name === 'string' &&
      typeof value.id === 'number' &&
      typeof value.type === 'number' &&
      typeof value.size === 'number'
  }

  static Position2D = new MeshAttribute(
    'position2d',
    0,
    GlDataType.Float,
    2
  )

  static Position3D = new MeshAttribute(
    'position3d',
    1,
    GlDataType.Float,
    3
  )

  static UV = new MeshAttribute(
    'uv',
    2,
    GlDataType.Float,
    2
  )

  static UVB = new MeshAttribute(
    'uvb',
    3,
    GlDataType.Float,
    2
  )

  static Normal2D = new MeshAttribute(
    'normal2d',
    4,
    GlDataType.Float,
    2
  )

  static Normal3D = new MeshAttribute(
    'normal3d',
    5,
    GlDataType.Float,
    3
  )

  static Tangent2D = new MeshAttribute(
    'tangent2d',
    6,
    GlDataType.Float,
    2
  )

  static Tangent3D = new MeshAttribute(
    'tangent3d',
    7,
    GlDataType.Float,
    3
  )

  static Color = new MeshAttribute(
    'color',
    8,
    GlDataType.Float,
    4
  )
}

/**
 * @typedef MeshAttributeSerial
 * @property {string} name
 * @property {number} id
 * @property {number} type
 * @property {number} size
 */
