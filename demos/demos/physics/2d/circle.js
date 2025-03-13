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

export const circle = new Demo('circle', [spawnBox, spawnGround, adjust2DGravity])

/**
 * @param {World} world
 */
function spawnBox(world) {
  const commands = /** @type {EntityCommands} */ (world.getResource('entitycommands'))
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const window = new Query(world, ['window']).single()

  if (!window) return warn('No window set up')
  
  const x = window[0].getWidth() / 2
  const y = window[0].getHeight() / 2
  
  commands
    .spawn()
    .insertPrefab(createRigidBody2D(x, y))
    .insert(meshes.add('physical circle', Mesh.circle2D(50)))
    .insert(Collider2D.circle(50))
    .insert(materials.add('physical', new CanvasMeshedMaterial({})))
    .insert(new Cleanup())
    .build()
}