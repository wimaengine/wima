import { Vector2 } from '../../math/index.js'
import { Attribute } from '../core/attribute.js'

/** */
export class Mesh {

  /**
   * @private
   * @type {Map<string,Attribute>}
   */
  attributes = new Map()

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

  static circle2D(radius = 0.5, segments = 16, arcstart = 0, arclength = Math.PI * 2) {
    const mesh = new Mesh()
    const vertices = [0, 0]
    const angleIncrement = arclength / segments
    const epilson = Math.pow(2, -31)

    for (let i = arcstart; i < arclength + epilson; i += angleIncrement) {
      const cos = Math.cos(i)
      const sin = Math.sin(i)

      vertices.push(
        radius * cos,
        radius * sin,
      )
    }

    mesh.setAttribute("position",
      new Attribute(new Float32Array(vertices), 2)
    )
    return mesh
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

  static
  default () {
    return new Mesh()
  }
}