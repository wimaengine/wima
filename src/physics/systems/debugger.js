import { Collider2D } from '../components/index.js'
import { Vector2 } from '../../math/index.js'
import { vertices } from '../../render-canvas2d/index.js'
import { Query, World, Entity } from '../../ecs/index.js'
import { Position2D } from '../../transform/index.js'
import { PhysicsHitbox } from '../../broadphase/index.js'
import { MainWindow, Windows } from '../../window/index.js'
import { Velocity2D } from '../../movable/index.js'

/**
 * @param {World} world
 */
export function drawBounds(world) {
  const query = new Query(world, [PhysicsHitbox])
  const windows = new Query(world, [Entity, MainWindow])

  /** @type {Windows} */
  const canvases = world.getResource('windows')
  const window = /** @type {[Entity,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  ctx.beginPath()
  ctx.lineWidth = 3
  ctx.strokeStyle = 'red'
  query.each(([bound]) => {

    const w = (bound.max.x - bound.min.x)
    const h = (bound.max.y - bound.min.y)

    ctx.strokeRect(
      bound.min.x,
      bound.min.y,
      w,
      h
    )
    ctx.closePath()
    ctx.stroke()
  })
}

/**
 * @param {World} world
 */
export function drawPosition(world) {
  const query = new Query(world, [Position2D])
  const windows = new Query(world, [Entity, MainWindow])

  /** @type {Windows} */
  const canvases = world.getResource('windows')
  const window = /** @type {[Entity,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  query.each(([position]) => {
    ctx.beginPath()
    ctx.arc(position.x, position.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()
  })
}

/**
 * @param {World} world
 */
export function drawVelocity(world) {
  const query = new Query(world, [Position2D, Velocity2D])
  const windows = new Query(world, [Entity, MainWindow])

  /** @type {Windows} */
  const canvases = world.getResource('windows')
  const window = /** @type {[Entity,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  ctx.beginPath()
  ctx.strokeStyle = 'cyan'
  query.each(([position, velocity]) => {
    drawArm(ctx, position, velocity)
  })
  ctx.stroke()
  ctx.closePath()
}

/**
 * @param {World} world
 */
export function drawShapes(world) {
  const windows = new Query(world, [Entity, MainWindow])

  /** @type {Windows} */
  const canvases = world.getResource('windows')
  const window = /** @type {[Entity,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  const query = new Query(world, [Collider2D])

  query.each(([shape]) => {
    ctx.beginPath()

    if (shape.type === Collider2D.Circle) {
      ctx.arc(
        shape.vertices[0].x,
        shape.vertices[0].y,
        shape.vertices[1].x,
        0,
        Math.PI * 2
      )
      const r = Vector2.fromAngle(shape.angle)

      Vector2.multiplyScalar(r, shape.vertices[1].x, r)
      drawArm(ctx, shape.vertices[0], r)
    } else {
      vertices(ctx, shape.vertices.flatMap((v) => [...v]), true)
    }

    ctx.strokeStyle = 'lightgreen'
    ctx.stroke()
    ctx.closePath()
  })
}

/**
 * @param {World} world
 */
export function drawArms(world) {
  const contacts = world.getResource('contacts')
  const windows = new Query(world, [Entity, MainWindow])

  /** @type {Windows} */
  const canvases = world.getResource('windows')
  const window = /** @type {[Entity,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  ctx.beginPath()

  for (let i = 0; i < contacts.length; i++) {
    const posA = world.get(contacts[i].entityA, 'transform')[0].position
    const posB = world.get(contacts[i].entityB, 'transform')[0].position

    for (let j = 0; j < contacts[i].contactData.contactNo; j++) {
      drawArmRaw(ctx, posA, contacts[i].contactData.contactPoints[j])
      drawArmRaw(ctx, posB, contacts[i].contactData.contactPoints[j])
    }
  }

  ctx.strokeStyle = 'yellow'
  ctx.stroke()
  ctx.closePath()
}

/**
 * @param {World} world
 */
export function drawContacts(world) {
  const windows = new Query(world, [Entity, MainWindow])

  /** @type {Windows} */
  const canvases = world.getResource('windows')
  const window = /** @type {[Entity,MainWindow]}*/(windows.single())

  const canvas = canvases.getWindow(window[0])
  const ctx = canvas.getContext('2d')

  if (!ctx) return
  
  const clmd = world.getResource('contacts')

  for (let i = 0; i < clmd.length; i++) {
    const [p1, p2] = clmd[i].contactData.contactPoints

    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.arc(p1.x, p1.y, 5, 0, Math.PI)

    if (clmd[i].contactData.contactNo === 2) ctx.arc(p2.x, p2.y, 5, 0, Math.PI)

    ctx.fill()
    ctx.closePath()
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Vector2} position
 * @param {Vector2} arm
 */
function drawArm(ctx, position, arm) {
  ctx.moveTo(position.x, position.y)
  ctx.lineTo(
    position.x + arm.x,
    position.y + arm.y
  )
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Vector2} position
 * @param {Vector2} arm
 */
function drawArmRaw(ctx, position, arm) {
  ctx.moveTo(position.x, position.y)
  ctx.lineTo(
    arm.x,
    arm.y
  )
}