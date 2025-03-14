import {
  Collider2D,
  createRigidBody2D,
  CanvasMeshedMaterial,
  World,
  Mesh,
  Cleanup,
  Demo
} from 'chaosstudio'
import { adjust2DGravity } from './util.js'

export const friction = new Demo(
  'friction',
  [spawnBoxes, spawnPlatforms, adjust2DGravity]
)

/**
 * @param {World} world
 */
export function spawnBoxes(world) {
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const commands = world.getResource('entitycommands')

  const width = 50
  const height = 50

  const mesh = meshes.add('physical box', Mesh.quad2D(width, height))
  const material = materials.add('physical', new CanvasMeshedMaterial({}))

  commands
    .spawn()
    .insertPrefab(createRigidBody2D(100, 200, Math.PI / 9))
    .insert(Collider2D.rectangle(width, height))
    .insert(mesh)
    .insert(material)
    .insert(new Cleanup())
    .build()
}

/**
 * @param {World} world
 */
function spawnPlatforms(world) {
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const commands = world.getResource('entitycommands')
  
  const width = 300
  const height = 20
  
  const mesh = meshes.add('physical floor', Mesh.quad2D(width, height))
  const material = materials.add('physical', new CanvasMeshedMaterial({}))

  commands
    .spawn()
    .insertPrefab(createRigidBody2D(700, 400, -Math.PI / 9, 0))
    .insert(Collider2D.rectangle(width, height))
    .insert(mesh)
    .insert(material)
    .insert(new Cleanup())
    .build()
  commands
    .spawn()
    .insertPrefab(createRigidBody2D(200, 400, Math.PI / 9, 0))
    .insert(Collider2D.rectangle(width, height))
    .insert(mesh)
    .insert(material)
    .insert(new Cleanup())
    .build()
}