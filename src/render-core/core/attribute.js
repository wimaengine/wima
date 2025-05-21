import { GlDataType } from '../../render-webgl/index.js'

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
}