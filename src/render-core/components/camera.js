import { OrthographicProjection, Projection, PerspectiveProjection } from '../core/index.js'

export class Camera {

  /**
   * @type {Projection}
   */
  projection

  /**
   * @param {Projection} projection
   * @param {number} near
   * @param {number} far
   */
  constructor(projection = new PerspectiveProjection(), near = 0.1, far = 1000) {
    this.projection = projection
    this.near = near
    this.far = far
  }

  /**
   * @param {Camera} source
   * @param {Camera} target
   */
  static copy(source, target = new Camera(source.projection, source.near, source.far)) {
    const {projection} = source
    if (projection instanceof PerspectiveProjection) {
      target.projection = new PerspectiveProjection(projection.fov, projection.aspect)
    } else if (projection instanceof OrthographicProjection) {
      target.projection = new OrthographicProjection(projection.left, projection.right, projection.top, projection.bottom)
    }

    target.near = source.near
    target.far = source.far

    return target
  }

  /**
   * @param {Camera} target
   */
  static clone(target) {
    return this.copy(target)
  }
  projectionMatrix() {
    return this.projection.asProjectionMatrix(this.near, this.far)
  }
}
