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
import { spawnGround, adjust2DGravity, stackpyramid } from './util.js'

export const pyramids = new Demo('pyramids', [spawnBoxes, spawnGround, adjust2DGravity])

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
  const mesh = meshes.add('physical box', Mesh.quad2D(width, height))
  const material = materials.add('physical', new CanvasMeshedMaterial({}))

  commands
    .spawnBatch(stackpyramid(x, y, width, height, 5, 10).map(([x, y]) => {
      return [
        ...createRigidBody2D(x, y),
        Collider2D.rectangle(width, height),
        mesh,
        material,
        new Cleanup()
      ]
    }))
}