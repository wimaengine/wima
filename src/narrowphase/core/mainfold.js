/** @import { Entity } from '../../ecs/index.js'*/
import { Vector2, Angle, clamp } from '../../math/index.js'
import { PhysicsSettings } from '../../physics/settings.js'


export class CollisionManifold {

  /**
   * @type {Entity}
   */
  entityA

  /**
   * @type {Entity}
   */
  entityB

  /**
   * @type {Vector2}
   */
  velocityA

  /**
   * @type {Vector2}
   */
  velocityB

  /**
   * @type {Angle}
   */
  rotationA

  /**
   * @type {Angle}
   */
  rotationB

  /**
   * @type {Vector2}
   */
  positionA

  /**
   * @type {Vector2}
   */
  positionB

  /**
   * @type {CollisionData}
   */
  contactData = new CollisionData()

  /**
   * @type {number[]}
   */
  impulse = [0.0, 0.0]

  /**
   * @type {number[]}
   */
  tImpulse = [0.0, 0.0]

  /**
   * @type {number[]}
   */
  nbias = [0.0, 0.0]

  /**
   * @type {Jacobian[]}
   */
  nJacobian = [new Jacobian(), new Jacobian()]

  /**
   * @type {Jacobian[]}
   */
  tJacobian = [new Jacobian(), new Jacobian()]

  /**
   * @type {number}
   */
  restitution = 0

  /**
   * @type {number}
   */
  staticFriction = 0

  /**
   * @type {number}
   */
  kineticFriction = 0

  /**
   * @type {number[]}
   */
  effectiveMass = [0, 0]

  /**
   * @type {number[]}
   */
  nLambda = [0, 0]

  /**
   * @type {number[]}
   */
  tLambda = [0, 0]

  /**
   * @type {number}
   */
  invmassA = 0

  /**
   * @type {number}
   */
  invmassB = 0

  /**
   * @type {number}
   */
  invinertiaA = 0

  /**
   * @type {number}
   */
  invinertiaB = 0

  /**
   * @param {Entity} a
   * @param {Entity} b
   * @param {Vector2} pA
   * @param {Vector2} pB
   * @param {Vector2} vA
   * @param {Vector2} vB
   * @param {Angle} rA
   * @param {Angle} rB
   */
  constructor(a, b, pA, pB, vA, vB, rA, rB) {
    this.entityA = a
    this.entityB = b
    this.velocityA = vA
    this.velocityB = vB
    this.rotationA = rA
    this.rotationB = rB
    this.positionA = pA
    this.positionB = pB
  }

  /**
   * @param {Jacobian} jacobian
   * @param {Vector2} velocityA
   * @param {Vector2} velocityB
   * @param {Angle} rotationA
   * @param {Angle} rotationB
   * @param {number} invmassA
   * @param {number} invmassB
   * @param {number} invinertiaA
   * @param {number} invinertiaB
   * @param {number} lambda
   */
  static applyImpulse(
    jacobian,
    velocityA,
    velocityB,
    rotationA,
    rotationB,
    invmassA,
    invmassB,
    invinertiaA,
    invinertiaB,
    lambda
  ) {
    const va = Vector2.multiplyScalar(jacobian.va, invmassA * lambda)
    const vb = Vector2.multiplyScalar(jacobian.vb, invmassB * lambda)

    Vector2.add(velocityA, va, velocityA)
    Vector2.add(velocityB, vb, velocityB)
    rotationA.value += invinertiaA * jacobian.wa * lambda
    rotationB.value += invinertiaB * jacobian.wb * lambda
  }

  /**
   * @param {CollisionManifold} manifold
   * @param {Vector2} positionA
   * @param {Vector2} positionB
   * @param {Vector2} velocityA
   * @param {Vector2} velocityB
   * @param {Angle} rotationA
   * @param {Angle} rotationB
   * @param {number} invDt
   */
  static prepare(
    manifold,
    positionA,
    positionB,
    velocityA,
    velocityB,
    rotationA,
    rotationB,
    invDt
  ) {
    const { axis, overlap, tangent, contactPoints, contactNo } = manifold.contactData
    const { invmassA, invmassB, invinertiaA, invinertiaB } = manifold

    for (let i = 0; i < contactNo; i++) {
      manifold.impulse[i] = 0
      manifold.tImpulse[i] = 0
      const ca1 = Vector2.subtract(contactPoints[i], positionA)
      const ca2 = Vector2.subtract(contactPoints[i], positionB)
      const va = Vector2.crossScalar(ca1, rotationA.value)

      Vector2.add(va, velocityA, va)
      const vb = Vector2.crossScalar(ca2, rotationB.value)

      Vector2.add(vb, velocityB, vb)
      const relativeVelocity = Vector2.subtract(vb, va, vb)

      manifold.nbias[i] = 0.0
      manifold.nJacobian[i].set(
        axis,
        Vector2.reverse(axis),
        Vector2.cross(ca1, axis),
        -Vector2.cross(ca2, axis)
      )

      // manifold.contactData.tangent.multiply(-Math.sign(manifold.contactData.tangent.dot(relativeVelocity)))
      manifold.tJacobian[i].set(
        tangent,
        Vector2.reverse(tangent),
        Vector2.cross(ca1, tangent),
        -Vector2.cross(ca2, tangent)
      )
      const normalVelocity = Vector2.dot(axis, relativeVelocity)

      manifold.nbias[i] = -(PhysicsSettings.posDampen * invDt) * Math.max(overlap - PhysicsSettings.penetrationSlop, 0.0)
      manifold.nbias[i] += (manifold.restitution) * Math.min(normalVelocity, 0.0)
      const k =
        invmassA +
        invmassB +
        manifold.nJacobian[i].wa * invinertiaA * manifold.nJacobian[i].wa +
        manifold.nJacobian[i].wb * invinertiaB * manifold.nJacobian[i].wb

      manifold.effectiveMass[i] = k > 0.0 ? 1.0 / k : 0.0
    }
  }

  /**
   * @param {CollisionManifold} manifold
   */
  static solve(
    manifold
  ) {
    const { velocityA, velocityB, rotationA, rotationB, invmassA, invmassB, invinertiaA, invinertiaB } = manifold

    for (let i = 0; i < manifold.contactData.contactNo; i++) {
      const nvaDot = Vector2.dot(
        manifold.nJacobian[i].va,
        velocityA
      )
      const nvbDot = Vector2.dot(
        manifold.nJacobian[i].vb,
        velocityB
      )
      const tvaDot = Vector2.dot(
        manifold.tJacobian[i].va,
        velocityA
      )
      const tvbDot = Vector2.dot(
        manifold.tJacobian[i].vb,
        velocityB
      )
      const jv = nvaDot +
        manifold.nJacobian[i].wa * rotationA.value +
        nvbDot +
        manifold.nJacobian[i].wb * rotationB.value
      const jt =
        tvaDot +
        manifold.tJacobian[i].wa * rotationA.value +
        tvbDot +
        manifold.tJacobian[i].wb * rotationB.value
      const nLambda = manifold.effectiveMass[i] * -(jv + manifold.nbias[i])
      const tLambda = manifold.effectiveMass[i] * -(jt)
      const oldImpulse = manifold.impulse[i]
      const oldtImpulse = manifold.tImpulse[i]

      if (PhysicsSettings.impulseAccumulation) {
        manifold.impulse[i] = Math.max(0.0, manifold.impulse[i] + nLambda)
        manifold.tImpulse[i] = Math.abs(tLambda) <= manifold.impulse[i] * manifold.staticFriction ?
          tLambda :
          tLambda * manifold.kineticFriction
        manifold.nLambda[i] = manifold.impulse[i] - oldImpulse
        manifold.tLambda[i] = manifold.tImpulse[i] - oldtImpulse
      } else {
        manifold.impulse[i] = Math.max(0.0, nLambda)
        const maxfriction = manifold.impulse[i] * manifold.kineticFriction

        // Math.abs(tLambda) <= manifold.impulse[i] * manifold.staticFriction ?
        manifold.tImpulse[i] = clamp(tLambda, -maxfriction, maxfriction)

        // tLambda :
        // -manifold.impulse[i] * manifold.kineticFriction
        manifold.nLambda[i] = manifold.impulse[i]
        manifold.tLambda[i] = manifold.tImpulse[i]
      }
    }

    for (let i = 0; i < manifold.contactData.contactNo; i++) {

      CollisionManifold.applyImpulse(
        manifold.nJacobian[i],
        manifold.velocityA,
        manifold.velocityB,
        manifold.rotationA,
        manifold.rotationB,
        invmassA,
        invmassB,
        invinertiaA,
        invinertiaB,
        manifold.nLambda[i]
      )

      if (manifold.nLambda[i] <= 0) continue

      CollisionManifold.applyImpulse(
        manifold.tJacobian[i],
        manifold.velocityA,
        manifold.velocityB,
        manifold.rotationA,
        manifold.rotationB,
        invmassA,
        invmassB,
        invinertiaA,
        invinertiaB,
        manifold.tLambda[i]
      ) /***/
    }
  }
}
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