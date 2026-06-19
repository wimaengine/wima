import { Vector2 } from '../../math/index.js'

export class Geometry {

  /**
   * @private
   * @type {Vector2[]}
   */
  vertices

  /**
   * @private
   * @type {Vector2[]}
   */
  normals

  /**
   * @private
   * @type {Vector2[]}
   */
  dynNormals

  /**
   * @param { Vector2[]} vertices
   */
  constructor(vertices) {
    this.vertices = vertices
    this.normals = Geometry.calcFaceNormals(vertices)
    this.dynNormals = this.normals.map((e) => Vector2.copy(e))
  }

  /**
   * @param {Geometry} value
   */
  static serialize(value) {
    return {
      vertices: value.vertices.map((vertex) => Vector2.serialize(vertex))
    }
  }

  /**
   * @param {GeometrySerial} value
   * @param {Geometry} [out]
   */
  static deserialize(value, out = new Geometry([])) {
    out.vertices = value.vertices.map((vertex) => Vector2.deserialize(vertex))
    out.normals = Geometry.calcFaceNormals(out.vertices)
    out.dynNormals = out.normals.map((vertex) => Vector2.copy(vertex))

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is GeometrySerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('vertices' in value)) {
      return false
    }

    if (!Array.isArray(value.vertices)) {
      return false
    }

    return value.vertices.every((vertex) => Vector2.validateSerial(vertex))
  }

  /**
   * @param {Geometry} geometry
   * @param {number} angle
   * @param {Vector2[]} out
   */
  static getNormals(geometry, angle, out = []) {
    for (let i = 0; i < geometry.normals.length; i++) {
      const normal = Vector2.rotate(geometry.normals[i], angle)

      // @ts-ignore
      out.push(normal)
    }

    return out
  }

  /**
   * @param {Vector2[]} vertices
   * @returns {Vector2[]}
   */
  static calcFaceNormals(vertices) {
    const axes = []
    let previous = vertices[vertices.length - 1]

    for (let i = 0; i < vertices.length; i++) {
      const current = vertices[i]
      const axis = Vector2.subtract(previous, current)

      Vector2.normal(axis, axis)
      Vector2.normalize(axis, axis)

      previous = current

      if (!checkifEquals(axis, axes)) axes.push(axis)
    }

    return axes
  }

  /**
   * @param {Geometry} geometry
   * @param {Vector2} pos
   * @param {number} angle
   * @param {Vector2} scale
   * @param {Vector2[]} out
   */
  static transform(geometry, pos, angle, scale, out) {
    const { vertices } = geometry
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    for (let i = 0; i < vertices.length; i++) {
      const vertex = out[i]

      Vector2.rotateFast(vertices[i], cos, sin, vertex)
      Vector2.multiply(vertex, scale, vertex)
      Vector2.add(vertex, pos, vertex)
    }
  }
}

/**
 * @typedef GeometrySerial
 * @property {import('../../math/core/vectors/float/vector2.js').Vector2Serial[]} vertices
 */

/**
 * @param {Vector2} axis
 * @param {Vector2[]} axes
 */
function checkifEquals(axis, axes) {
  for (let i = 0; i < axes.length; i++) if (absEquals(axis, axes[i])) return true

  return false
}

/**
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function absEquals(v1, v2) {
  return (
    Math.abs(v1.x) === Math.abs(v2.x) ||
    Math.abs(v1.y) === Math.abs(v2.y)
  )
}
