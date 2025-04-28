import { Vector2 } from '../../math/index.js'
import { Geometry } from '../core/geometry.js'
import { ShapeType } from '../settings.js'


/**
 * This class makes a body tangible
 * to collision detection and response.Without it,the body will not be able to interact with other bodies.
 */
export class Collider2D {

  /**
   * Used to determine what type of shape this is.
   *
   * @type {ShapeType}
   * @readonly
   */
  type = ShapeType.POLYGON

  /**
   * @type {number}
   */
  angle = 0

  /**
   * The vertices describing the shape.
   *
   * @type {Vector2[]}
   */
  vertices

  /**
   * Keeps the original normals and vertices of this shape.
   *
   * @type {Geometry}
   */
  geometry

  /**
   * @param { Vector2[]} vertices - The vertices of the shape in local space coordinates.
   */
  constructor(vertices) {

    // @ts-ignore
    this.vertices = vertices.map((v) => Vector2.copy(v))
    this.geometry = new Geometry(vertices)
  }

  /**
   * @param {number} width
   * @param {number} height
   */
  static rectangle(width, height) {
    const v1 = new Vector2(-width / 2, -height / 2)
    const v2 = new Vector2(-width / 2, height / 2)
    const v3 = new Vector2(width / 2, height / 2)
    const v4 = new Vector2(width / 2, -height / 2)

    return new Collider2D([v1, v2, v3, v4])
  }

  /**
   * @param {number} base - Length of one side.
   * @param {number} height - Length of a second side.
   * @param {number} angle - The angle between the two sides.
   */
  static triangle(base, height, angle = Math.asin(height / base)) {
    const l1 = new Vector2(base)
    const l2 = Vector2.fromAngle(angle)

    Vector2.multiplyScalar(l2, -height / Math.sin(angle), l2)

    const center = new Vector2(-(l1.x + l2.x) / 3, -l2.y / 3)

    return new Collider2D([
      center,

      // @ts-ignore
      Vector2.add(l1, center, l1),

      // @ts-ignore
      Vector2.add(l2, center, l2)
    ])
  }

  /**
   * @param {number} length
   */
  static line(length) {
    const start = new Vector2(length / 2)
    const end = new Vector2(-length / 2)

    return new Collider2D([start, end])
  }

  /**
   * @param {number} radius
   */
  static circle(radius) {

    // the first vertex is position
    // the second vertex x-position is radius
    //
    const shape = new Collider2D([
      new Vector2(),
      new Vector2(radius, radius)
    ])


    // @ts-ignore
    shape.type = Collider2D.Circle

    return shape
  }

  /**
   * Returns the normals of the faces when rotated.
   * @param {Collider2D} shapeA
   * @param {Collider2D} shapeB
   * @param {Vector2[]} [out] - An array where results are stored.
   * @returns {Vector2[]}
   */
  static getNormals(shapeA, shapeB, out = []) {
    if (shapeA.type === Collider2D.POLYGON) return Geometry.getNormals(shapeA.geometry, shapeA.angle, out)

    let vertex = shapeB.vertices[0]

    if (shapeB.type === Collider2D.POLYGON) vertex = shapeB.vertices[getNearVertex(shapeA.vertices[0], shapeA.vertices)]

    const normal = Vector2.copy(vertex)

    Vector2.sub(normal, shapeA.vertices[0], normal)
    Vector2.normalize(normal, normal)

    // @ts-ignore
    out.push(normal)

    return out
  }

  /**
   * Transforms the local coordinates of the vertices to world coordinates.
   *
   * @param {Collider2D} shape
   * @param {Vector2} position - The world position of the body.
   * @param {number} angle - The orientation of body.
   * @param {Vector2} scale - The scale of the body.
   */
  static update(shape, position, angle, scale) {
    shape.angle = angle

    if (shape.type === ShapeType.Circle) {
      Vector2.copy(position, shape.vertices[0])

      return
    }

    Geometry.transform(
      shape.geometry,
      position,
      angle,
      scale,
      shape.vertices
    )
  }

  /**
   * Returns the world coordinates of the vertices.
   * @template {Collider2D} T
   * @param {T} shape
   * @param { Vector2 } axis
   * @param { Vector2[] } out
   * @returns { Vector2[] }
   */
  static getVertices(shape, axis, out = []) {
    if (shape.type === Collider2D.POLYGON) return shape.vertices

    const v1 = Vector2.multiplyScalar(axis, -shape.vertices[1].x)
    const v2 = Vector2.multiplyScalar(axis, shape.vertices[1].x)

    Vector2.add(v1, shape.vertices[0], v1)
    Vector2.add(v2, shape.vertices[0], v2)

    // @ts-ignore
    out[0] = v1

    // @ts-ignore
    out[1] = v2

    return out
  }

  /**
   * TODO - Actually implement this.
   * @param {Collider2D} shape
   */
  static getArea(shape) {
    if (shape.type === Collider2D.POLYGON) {
      return 0
    }

    return 0
  }

  /**
   * Calculates the inertia of a given shape.
   *
   * @param {Collider2D} shape
   * @param {number} mass
   * @returns {number}
   */
  static calcInertia(shape, mass) {
    const { vertices } = shape

    if (shape.type === Collider2D.Circle) {
      const radius = vertices[1].x

      return mass * (radius * radius) * 0.5
    }

    const vertexCount = vertices.length
    let numerator = 0.0
    let denominator = 0.0
    let i = vertexCount - 1

    for (let j = 0; j < vertexCount; ++j) {
      const v1 = vertices[i]
      const v2 = vertices[j]
      const crs = Math.abs(Vector2.cross(v1, v2))

      numerator += crs * (Vector2.dot(v2, v2) + Vector2.dot(v1, v2) + Vector2.dot(v1, v1))
      denominator += crs
      i = j
    }

    return mass * numerator / (denominator * 6.0)
  }
  static Circle = 0
  static POLYGON = 1
}

/**
 * @param {Vector2} position
 * @param {Vector2[]} vertices
 */
function getNearVertex(position, vertices) {
  let vertex = 0
  let min = -Infinity

  for (let i = 0; i < vertices.length; i++) {
    const a = Vector2.distanceToSquared(vertices[i], position)

    if (min > a) {
      vertex = i
      min = a
    }
  }

  return vertex
}