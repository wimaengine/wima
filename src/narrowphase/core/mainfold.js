/** @import { Entity } from '../../ecs/index.js'*/
import { Vector2 } from '../../math/index.js'

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