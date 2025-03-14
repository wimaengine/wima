import {
  Mesh,
  CanvasMeshedMaterial,
  Collider2D,
  World,
  Demo,
  createRigidBody2D,
  Cleanup
} from 'chaosstudio'
import { spawnGround, adjust2DGravity, stack } from './util.js'

export const restitution = new Demo('restitution', [spawnBoxes, spawnGround, adjust2DGravity])

/**
 * @param {World} world
 */
function spawnBoxes(world) {
  const x = 100
  const y = 100
  const width = 50
  const height = 50

  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const commands = world.getResource('entitycommands')

  const positions = stack(x, y, width, height, 5, 1, 100)
  
  commands.spawnBatch(
    positions.map((position, i) => {
      return [
        ...createRigidBody2D(position.x, position.y, 0, 1, i / (positions.length - 1)),
        Collider2D.rectangle(width, height),
        meshes.add('physical box', Mesh.quad2D(width, height)),
        materials.add('physical', new CanvasMeshedMaterial({})),
        new Cleanup()
      ]
    })
  )  
}