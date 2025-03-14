/** @import {Entity} from 'chaosstudio' */
import {
  Collider2D,
  Mesh,
  CanvasMeshedMaterial,
  createRigidBody2D,
  World,
  Demo,
  Query,
  EntityCommands,
  Cleanup,
  warn
} from 'chaosstudio'
import { spawnGround, adjust2DGravity } from './util.js'

export const collisionMasks = new Demo('collision masks', [spawnBoxes, spawnGround, adjust2DGravity])

const Groups = {
  One: 1n << 0n,
  Two: 1n << 1n,
  Three: 1n << 2n,
  All: 0xFFFFFFFFn
}

/**
 * @param {World} world
 */
function spawnBoxes(world) {
  const commands = /** @type {EntityCommands} */ (world.getResource('entitycommands'))
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const window = new Query(world, ['window']).single()

  const width = 50
  const height = 50

  const mesh = meshes.add('physical floor', Mesh.quad2D(width, height))
  const material = materials.add('physical', new CanvasMeshedMaterial({}))

  if (!window) return warn('No window set up')
  
  const x = window[0].getWidth() / 2
  
  commands
    .spawn()
    .insertPrefab(createRigidBody2D(
      x - 100,
      200,
      0,
      0.3,
      1,
      1,
      Groups.One,
      Groups.One
    ))
    .insert(Collider2D.rectangle(width, height))
    .insert(mesh)
    .insert(material)
    .insert(new Cleanup())
    .build()

  commands
    .spawn()
    .insertPrefab(createRigidBody2D(
      x - 100,
      400,
      0,
      0.3,
      1,
      1,
      Groups.One,
      Groups.One
    ))
    .insert(mesh)
    .insert(material)
    .insert(new Cleanup())
    .insert(Collider2D.rectangle(50, 50))
    .build()

  commands
    .spawn()
    .insertPrefab(createRigidBody2D(
      x + 100,
      200,
      0,
      0.3,
      1,
      1,
      Groups.One,
      Groups.Two
    ))
    .insert(Collider2D.rectangle(50, 50))
    .insert(mesh)
    .insert(material)
    .insert(new Cleanup())
    .build()

  commands
    .spawn()
    .insertPrefab(createRigidBody2D(
      x + 100,
      400,
      0,
      0.3,
      0,
      1,
      Groups.One,
      Groups.One
    ))
    .insert(Collider2D.rectangle(50, 50))
    .insert(mesh)
    .insert(material)
    .insert(new Cleanup())
    .build()
}