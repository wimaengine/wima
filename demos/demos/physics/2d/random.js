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

export const random = new Demo(
  'random',
  [spawnGround, adjust2DGravity],
  [spawnAndDespawn]
)

/**
 * @param {World} world
 */
function spawnAndDespawn(world){
  const commands = /** @type {EntityCommands} */ (world.getResource('entitycommands'))
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const window = new Query(world, ['window']).single()
  const query = new Query(world, ['entity', 'collider2d'])
  
  if (!window) return warn('No window set up')
  
  const x = Math.random() * window[0].getWidth() / 2
  const y = Math.random() * window[0].getHeight() / 2
  const width = 50
  const height = 50
    
  const mesh = meshes.add('physical box', Mesh.quad2D(width, height))
  const material = materials.add('physical', new CanvasMeshedMaterial({}))
    
  if(query.count() > 100) return

  commands
    .spawn()
    .insertPrefab([
      ...createRigidBody2D(x, y),
      Collider2D.rectangle(width, height),
      mesh,
      material,
      new Cleanup()
    ])
    .build()      
}