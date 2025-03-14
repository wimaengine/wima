/** @import {Entity} from 'chaosstudio' */
import {
  Collider2D,
  PhysicsProperties,
  Mesh,
  CanvasMeshedMaterial,
  createRigidBody2D,
  World,
  Query,
  EntityCommands,
  Vector2,
  Cleanup,
  warn
} from 'chaosstudio'

/**
 * System which spawns the ground for the physics demos.
 * 
 * @param {World} world
 */
export function spawnGround(world) {
  const commands = /** @type {EntityCommands} */ (world.getResource('entitycommands'))
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')

  const window = new Query(world, ['window']).single()

  if (!window) return warn('No window set up')

  const windowWidth = window[0].getWidth()
  const windowHeight = window[0].getHeight()

  const x = windowWidth / 2
  const y = windowHeight - 50

  const width = windowWidth
  const height = 50

  commands
    .spawn()
    .insertPrefab(createRigidBody2D(x, y))
    .insert(meshes.add('ground physical', Mesh.quad2D(width, height)))
    .insert(Collider2D.rectangle(width, height))
    .insert(materials.add('physical', new CanvasMeshedMaterial({})))
    .insert(new Cleanup())
    .insert(new PhysicsProperties())
    .build()
}

/**
 * System which adjusts the cameras to make origin start at bottom left
 * and y axis to go upwards.
 * 
 * @param {World} world
 */
export function adjust2DGravity(world) {
  const gravity = world.getResource('gravity2d')

  gravity.y = 980
}

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
 * @param {number} nx 
 * @param {number} ny 
 * @param {number} sx 
 * @param {number} sy 
 * @returns {Vector2[]}
 */
export function stack(x, y, w, h, nx, ny, sx = 0, sy = 0){
  const positions = []

  for (let startX = 0; startX < nx; startX++) {
    for (let startY = 0; startY < ny; startY++) {
      positions.push(new Vector2(
        x + (w + sx) * startX,
        y + (h + sy) * startY
      ))
    }
    
  }

  return positions
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} no
 * @param {number} spacing
 * @returns {[number,number][]}
 */
export function stackpyramid(x, y, w, h, no, spacing) {

  /** @type {[number,number][]} */
  const positions = []
  let dx = x - (w / 2 * no)
 
  for (let j = 0; j < no; j++) {
    dx += w / 2

    for (let i = 0; i < j; i++) {
      positions.push([
        dx - w * i,
        y + (h + spacing) * j
      ])
    }
  }

  return positions
}