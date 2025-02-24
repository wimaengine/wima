import { Vector2, clamp } from '../../math/index.js'
import { Collider2D, PhysicsProperties } from '../../physics/components/index.js'
import { PhysicsSettings } from '../../physics/settings.js'
import { canCollide, shapeContains, generatePairID, CollisionData, CollisionManifold } from '../core/index.js'
import { Query, World } from '../../ecs/index.js'
import { Contacts, SATNarrowphase2D } from '../resources/index.js'
import { Position2D } from '../../transform/index.js'
import { Rotation2D, Velocity2D } from '../../movable/index.js'
import { CollisionPairs } from '../../broadphase/index.js'


const
  tmp2 = {
    min: 0,
    max: 0
  },
  tmp3 = {
    min: 0,
    max: 0
  },
  tmp4 = new Vector2(),
  tmp5 = new Vector2()

/**
 * @param {World} world
 */
export function getSATContacts(world) {
  const narrowphase = world.getResource(SATNarrowphase2D)
  const pairs = world.getResource(CollisionPairs)
  const contacts = world.getResource(Contacts)
  const query = new Query(world, [Position2D, Velocity2D, Rotation2D, Collider2D, PhysicsProperties])

  contacts.length = 0

  for (let i = 0; i < pairs.length; i++) {
    const { a, b } = pairs[i]
    const getA = query.get(a)
    const getB = query.get(b)

    if (!getA || !getB) continue

    const [positionA, velocityA, rotationA, shapeA, propertiesA] = getA
    const [positionB, velocityB, rotationB, shapeB, propertiesB] = getB

    if (!canCollide(propertiesA, propertiesB)) continue

    propertiesA.sleep = false
    propertiesB.sleep = false
    const id = generatePairID(a.index, b.index)

    if (!narrowphase.clmdrecord.has(id)) narrowphase.clmdrecord.set(id, new CollisionManifold(
      a,
      b,
      positionA,
      positionB,
      velocityA,
      velocityB,
      rotationA,
      rotationB
    ))

    const manifold = narrowphase.clmdrecord.get(id)

    if (!manifold) continue

    const collisionData = manifold.contactData

    collisionData.overlap = -Infinity
    collisionData.done = false
    shapesInBodyCollided(shapeA, shapeB, propertiesA.invmass, propertiesB.invmass, collisionData)

    if (collisionData.overlap < 0 || !collisionData.done) continue

    manifold.restitution = propertiesA.restitution < propertiesB.restitution ? propertiesA.restitution : propertiesB.restitution

    // manifold.staticFriction = propertiesA.staticFriction < propertiesB.staticFriction ? propertiesA.staticFriction : propertiesB.staticFriction
    manifold.kineticFriction = propertiesA.kineticFriction < propertiesB.kineticFriction ? propertiesA.kineticFriction : propertiesB.kineticFriction
    manifold.invmassA = propertiesA.invmass
    manifold.invmassB = propertiesB.invmass
    manifold.invinertiaA = propertiesA.invinertia
    manifold.invinertiaB = propertiesB.invinertia
    contacts.push(manifold)
  }
}

/**
 * @param {Collider2D} shapeA
 * @param {Collider2D} shapeB
 * @param {any} invmassA
 * @param {number} invmassB
 * @param {CollisionData} out
 */
function shapesInBodyCollided(shapeA, shapeB, invmassA, invmassB, out) {

  /** @type {Vector2[]}*/
  const arr = []

  Collider2D.getNormals(shapeA, shapeB, arr)
  Collider2D.getNormals(shapeB, shapeA, arr)
  projectShapesToAxes(shapeA, shapeB, arr, out)

  if (out.overlap < 0) return out

  Vector2.normal(out.axis, out.tangent)
  const { contactPoints } = out
  const { axis } = out
  const axisReverse = Vector2.reverse(axis, tmp5)
  const overload = []

  // @ts-ignore
  const vertices1 = findNearSupports(out.vertShapeA, axis, [])

  // @ts-ignore
  const vertices2 = findNearSupports(out.vertShapeB, axisReverse, [])
  const balancedOverlap = out.overlap / (invmassA + invmassB)

  for (let i = 0; i < vertices2.length; i++) {
    if (shapeContains(shapeA, vertices2[i])) {
      overload.push(vertices2[i])
    }
  }

  if (overload.length < 2) {
    for (let i = 0; i < vertices1.length; i++) {
      if (shapeContains(shapeB, vertices1[i])) {
        overload.push(vertices1[i])
      }
    }
  }

  // some random error happened when this is not there.
  // Dont know if it isnt there now but i dont want to risk it ¯⁠\⁠_⁠(⁠ツ⁠)⁠_⁠/⁠¯
  if (overload.length === 0) {
    overload.push(vertices2[0])
  }

  Vector2.multiplyScalar(axis, -balancedOverlap * invmassB, tmp4)
  Vector2.add(tmp4, overload[0], contactPoints[0])

  if (overload.length > 1) {
    Vector2.add(tmp4, overload[1], contactPoints[1])
  }

  out.contactNo =
    shapeA.type === Collider2D.Circle ||
      shapeB.type === Collider2D.Circle ?
      1 : clamp(overload.length, 0, 2)

  return out
}

/**
 * @param {Collider2D} shapeA
 * @param {Collider2D} shapeB
 * @param {Vector2[]} axes
 * @param {CollisionData} manifold
 */
function projectShapesToAxes(shapeA, shapeB, axes, manifold) {
  let minVerticesA = null
  let minVerticesB = null
  let minOverlap = Infinity
  const minaxis = new Vector2()

  for (let i = 0; i < axes.length; i++) {
    const axis = Vector2.copy(axes[i], tmp4)

    // @ts-ignore
    const verticesA = Collider2D.getVertices(shapeA, axis)

    // @ts-ignore
    const verticesB = Collider2D.getVertices(shapeB, axis)
    const p1 = projectVerticesToAxis(verticesA, axis, tmp2)
    const p2 = projectVerticesToAxis(verticesB, axis, tmp3)
    const min = p1.max < p2.max ? p1.max : p2.max
    const max = p1.min > p2.min ? p1.min : p2.min
    let overlap = min - max

    if (overlap < 0) return manifold
    if (p1.max < p2.max) Vector2.reverse(axis, axis)
    if (
      (p1.max > p2.max && p1.min < p2.min) ||
      (p2.max > p1.max && p2.min < p1.min)
    ) {
      const max = Math.abs(p1.max - p2.max),
        min = Math.abs(p1.min - p2.min)

      if (min < max) {
        overlap += min
      } else {
        overlap += max

        // Vector2.reverse(axis, axis)
      }
    }
    if (overlap < minOverlap) {
      Vector2.copy(axis, minaxis)
      minOverlap = overlap

      // @ts-ignore
      minVerticesA = verticesA

      // @ts-ignore
      minVerticesB = verticesB
    }
  }

  if (minOverlap > manifold.overlap) {
    Vector2.copy(minaxis, manifold.axis)
    manifold.overlap = minOverlap

    // @ts-ignore
    manifold.vertShapeA = minVerticesA

    // @ts-ignore
    manifold.vertShapeB = minVerticesB
    manifold.done = true
  }

  return manifold
}

/**
 * @param {Vector2[]} vertices
 * @param {Vector2} axis
 * @param {ColliderProjection} out
 */
function projectVerticesToAxis(vertices, axis, out) {
  let min = Infinity,
    max = -Infinity
  const { length } = vertices

  for (let i = 0; i < length; i++) {
    const point = Vector2.dot(axis, vertices[i])

    if (point < min) min = point
    if (point > max) max = point
  }

  out.min = min
  out.max = max

  return out
}

/**
 * @param { Vector2[]} vertices
 * @param { Vector2} axis
 * @param { Vector2[]} target
 */
function findNearSupports(vertices, axis, target = []) {
  let min = Infinity

  for (let i = 0; i < vertices.length; i++) {
    const point = Vector2.dot(axis, vertices[i])

    if (
      Math.abs(point - min) <= PhysicsSettings.separationTolerance &&
      !target.includes(vertices[i])
    ) {
      target.push(vertices[i])
      continue
    }
    if (point < min) {
      min = point
      target.length = 0
      target.push(vertices[i])
      i = -1
    }
  }

  return target
}

/**
 * @typedef ColliderProjection
 * @property {number} max
 * @property {number} min
 */