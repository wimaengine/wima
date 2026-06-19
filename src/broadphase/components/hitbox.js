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
    return PhysicsHitbox.copy(target)
  }

  /**
   * @param {PhysicsHitbox} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('../../geometry/index.js').BoundingBox2DSerial} value
   * @param {PhysicsHitbox} [out]
   */
  static deserialize(value, out = new PhysicsHitbox()) {
    return super.deserialize(value, out)
  }
}
