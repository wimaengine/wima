/** @import { Entity } from '../../ecs/index.js'*/
import { Vector2 } from '../../math/index.js'


export class CollisionData {

  /**
   * @type {number}
   */
  overlap = 0

  /**
   * @type {boolean}
   */
  done = false

  /**
   * @type {Vector2}
   */
  axis = new Vector2()

  /**
   * @type {Vector2}
   */
  tangent = new Vector2()

  /**
   * @type {Vector2[]}
   */
  contactPoints = [new Vector2(), new Vector2()]

  /**
   * @type {number}
   */
  contactNo = 0
}
export class Jacobian {

  /**
   * @type {Vector2}
   */
  va = new Vector2()

  /**
   * @type {number}
   */
  wa = 0

  /**
   * @type {Vector2}
   */
  vb = new Vector2()

  /**
   * @type {number}
   */
  wb = 0

  /**
   * @param {Vector2} [va]
   * @param {Vector2} [vb]
   * @param {number} [wa]
   * @param {number} [wb]
   */
  constructor(va, vb, wa, wb) {
    this.set(va, vb, wa, wb)
  }

  /**
   * @param {Vector2} [va]
   * @param {Vector2} [vb]
   * @param {number} [wa]
   * @param {number } [wb]
   */
  set(va, vb, wa, wb) {
    if (va) Vector2.copy(va, this.va)
    if (vb) Vector2.copy(vb, this.vb)
    if (wa) this.wa = wa
    if (wb) this.wb = wb
  }
}