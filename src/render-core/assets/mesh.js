import { Vector2 } from '../../math/index.js'
import { GlDataType } from '../../render-webgl/index.js'
import { AttributeLocation } from '../core/atributelocation.js'
import { Attribute } from '../core/attribute.js'

/** */
export class Mesh {

  /**
   * @private
   * @type {Uint16Array | undefined}
   */
  indices

  /**
   * @private
   * @type {Map<string,Attribute>}
   */
  attributes = new Map()

  /**
   * @returns {Uint16Array | undefined}
   */
  getIndices(){
    return this.indices
  }

  /**
   * @param {Uint16Array | undefined} indices
   */
  setIndices(indices){
    this.indices = indices
  }

  /**
   * @param {string} name
   * @returns {Attribute | undefined} 
   */
  getAttribute(name) {
    return this.attributes.get(name)
  }

  /**
   * @param {string} name
   * @param {Attribute} attribute
   */
  setAttribute(name, attribute) {
    this.attributes.set(name, attribute)
  }

  /**
   * @returns {Readonly<Map<string,Attribute>>}
   */
  getAttributes(){
    return this.attributes
  }

  /**
   * @param {string} name 
   */
  deleteAttribute(name) {
    this.attributes.delete(name)
  }

  /**
   * @param {number} width
   * @param {number} height
   * @returns {Mesh}
   */
  static quad2D(width, height) {
    const geometry = new Mesh()
    const positions = new Float32Array([
      -width / 2,
      -height / 2,
      -width / 2,
      height / 2,
      width / 2,
      height / 2,
      width / 2,
      -height / 2
    ])

    geometry.setAttribute('position', new Attribute(positions, 2))

    return geometry
  }

  /**
   * @param {number} radius
   * @param {number} resolution
   * @returns {Mesh}
   */
  static circle2D(radius, resolution = 16) {
    const geometry = new Mesh()
    const positions = new Float32Array([radius, radius])


    // TODO - fix up resolution
    geometry.setAttribute('position', new Attribute(positions, 2))

    return geometry
  }

  /**
   * @param {number} base
   * @param {number} height
   * @param {number} angle
   * @returns {Mesh}
   */
  static triangle2D(base, height, angle = Math.asin(height / base)) {
    const geometry = new Mesh()
    const l1 = new Vector2(base)
    const l2 = Vector2.fromAngle(angle)

    Vector2.multiplyScalar(l2, -height / Math.sin(angle), l2)
    const x = -(l1.x + l2.x) / 3
    const y = -l2.y / 3
    const positions = new Float32Array([
      x,
      y,
      l1.x + x,
      l1.y + y,
      l2.x + x,
      l2.y + y
    ])

    geometry.setAttribute('position', new Attribute(positions, 2))

    return geometry
  }

  static default() {
    return new Mesh()
  }
  
  static Position2DLocation = new AttributeLocation(
    'position2d',
    0,
    GlDataType.Float,
    2
  )
  static Position3DLocation = new AttributeLocation(
    'position3d',
    1,
    GlDataType.Float,
    3
  )
  static UVLocation = new AttributeLocation(
    'uv',
    2,
    GlDataType.Float,
    2
  )
  static UVBLocation = new AttributeLocation(
    'uvb',
    3,
    GlDataType.Float,
    2
  )
  static Normal2DLocation = new AttributeLocation(
    'normal2d',
    4,
    GlDataType.Float,
    2
  )  
  static Normal3DLocation = new AttributeLocation(
    'normal3d',
    5,
    GlDataType.Float,
    3
  )
  static Tangent2DLocation = new AttributeLocation(
    'tangent2d',
    6,
    GlDataType.Float,
    2
  )
}