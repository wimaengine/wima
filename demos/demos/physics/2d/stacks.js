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
import { spawnGround, adjust2DGravity, stack } from './util.js'

export const stacks = new Demo('stacks', [spawnBoxes, spawnGround, adjust2DGravity])

/**
 * @param {World} world
 */
function spawnBoxes(world) {
  const commands = /** @type {EntityCommands} */ (world.getResource('entitycommands'))
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const window = new Query(world, ['window']).single()

  if (!window) return warn('No window set up')

  const x = window[0].getWidth() / 2
  const y = window[0].getHeight() / 2
  const width = 50
  const height = 50

  const mesh = meshes.add('physical', Mesh.quad2D(width, height))
  const material = materials.add('physical', new CanvasMeshedMaterial({}))

  const positions = stack(x, y, width, height, 1, 10, 0, 0)

  commands.spawnBatch(positions.map((position) => {
    return [
      ...createRigidBody2D(position.x, position.y),
      Collider2D.rectangle(width, height),
      material,
      mesh,
      new Cleanup()
    ]
  }))
}