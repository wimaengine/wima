import { BoundingBox2D } from '../../geometry/index.js'

export class PhysicsHitbox extends BoundingBox2D {

  /**
   * @param {PhysicsHitbox} source
   * @param {PhysicsHitbox} target
   */
  static copy(source, target = new PhysicsHitbox()) {
    return super.copy(source, target)
  }

  /**
   * @param {PhysicsHitbox} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
