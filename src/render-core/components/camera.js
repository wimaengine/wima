import { Projection, PerspectiveProjection } from '../core/index.js'

export class Camera {

  /**
   * @type {Projection}
   */
  projection
  constructor(projection = new PerspectiveProjection(), near = 0.1, far = 1000) {
    this.projection = projection
    this.near = near
    this.far = far
  }
  projectionMatrix() {
    return this.projection.asProjectionMatrix(this.near, this.far)
  }
}