import {
  BasicMaterial,
  Demo,
  Mesh,
  World,
  Cleanup,
  Query,
  EntityCommands,
  VirtualClock,
  BasicMaterial2D,
  Meshed,
  createTransform2D,
  Orientation2D,
  GlobalTransform2D,
  Vector2,
  Affine2,
  Rotary,
  Position2D,
  Color,
  HALF_PI
} from 'wima'
import { addDefaultCamera2D, BasicMaterialAssets, MeshAssets } from '../../utils.js'

export default new Demo(
  'transform2d/lookAt',
  [spawnLookers, spawnTarget, addDefaultCamera2D],
  [updateLookers, updateTarget]
)

/**
 * @param {World} world
 */
function spawnLookers(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add('lookers', Mesh.triangle2D(10, 50))
  const material = materials.add('lookers', new BasicMaterial())

  for (let x = -innerWidth / 2; x < innerWidth / 2; x += 100) {
    for (let y = -innerHeight / 2; y < innerHeight / 2; y += 100) {
      commands
        .spawn()
        .insertPrefab([
          ...createTransform2D(x, y),
          new Meshed(mesh),
          new BasicMaterial2D(material),
          new Looker(),
          new Cleanup()
        ])
        .build()
    }

  }
}

/**
 * @param {World} world
 */
function spawnTarget(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add('target', Mesh.circle2D(10))
  const material = materials.add('target', new BasicMaterial({
    color:new Color(0, 1, 1)
  }))

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Target(),
      new Cleanup()
    ])
    .build()
}

/**
 * @param {World} world
 */
function updateLookers(world) {
  const lookers = new Query(world, [Orientation2D, GlobalTransform2D, Looker])
  const target = new Query(world, [GlobalTransform2D, Target]).single()

  if (!target) return

  const targetPosition = new Vector2(
    target[0].x,
    target[0].y
  )

  lookers.each(([orientation, transform]) => {
    const position = new Vector2(
      transform.x,
      transform.y
    )
    const lookAt = Affine2.lookAt(position, targetPosition)

    // eslint-disable-next-line no-unused-vars
    const [_, finalOrientation] = lookAt.decompose()
    const angle = Rotary.toAngle(finalOrientation)

    orientation.value = angle - HALF_PI
  })
}

/**
 * @param {World} world
 */
function updateTarget(world) {
  const target = new Query(world, [Position2D, Target]).single()
  const clock = world.getResource(VirtualClock)
  const dt = clock.getElapsed()
  const speed = 0.3
  const frequencyX = 3
  const frequencyY = 1
  const amplitudeX = innerWidth / 2 - 100
  const amplitudeY = innerHeight / 2 - 100

  if (!target) return

  const [position] = target

  position.x = amplitudeX * Math.cos(dt * frequencyX * speed)
  position.y = amplitudeY * Math.sin(dt * frequencyY * speed)
}

class Target { }
class Looker { }