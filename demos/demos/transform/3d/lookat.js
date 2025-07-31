import {
  BasicMaterial,
  Demo,
  Mesh,
  World,
  Cleanup,
  Query,
  EntityCommands,
  VirtualClock,
  BasicMaterial3D,
  Meshed,
  createTransform3D,
  Orientation3D,
  GlobalTransform3D,
  Vector3,
  Affine3,
  Position3D,
  Color
} from 'wima'
import { addDefaultCamera3D, BasicMaterialAssets, MeshAssets } from '../../utils.js'

export default new Demo(
  'transform3d/lookAt',
  [addLookers, addTarget, addDefaultCamera3D],
  [updateLookers, updateTarget]
)

/**
 * @param {World} world
 */
function addLookers(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add('looker', Mesh.cube(0.03, 0.03, 0.1))
  const material = materials.add('looker', new BasicMaterial())

  for (let x = -1.5; x < 1.5; x += 0.1) {
    for (let y = -1.5; y < 1.5; y += 0.1) {
      commands
        .spawn()
        .insertPrefab([
          ...createTransform3D(x, y),
          new Meshed(mesh),
          new BasicMaterial3D(material),
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
function addTarget(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add('target', Mesh.cube(0.05, 0.05, 0.05))
  const material = materials.add('target', new BasicMaterial({
    color: new Color(0, 1, 1)
  }))

  commands
    .spawn()
    .insertPrefab([
      ...createTransform3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new Target(),
      new Cleanup()
    ])
    .build()
}

/**
 * @param {World} world
 */
function updateLookers(world) {
  const lookers = new Query(world, [Orientation3D, GlobalTransform3D, Looker])
  const target = new Query(world, [GlobalTransform3D, Target]).single()

  if (!target) return

  const targetPosition = Vector3.set(
    target[0].x,
    target[0].y,
    target[0].z
  )

  lookers.each(([orientation, transform]) => {
    const eye = new Vector3(
      transform.x,
      transform.y,
      transform.z
    )
    const lookAt = Affine3.lookAt(eye, targetPosition, Vector3.Y)

    // eslint-disable-next-line no-unused-vars
    const [_, finalOrientation] = lookAt.decompose()

    orientation.copy(finalOrientation)
  })
}

/**
 * @param {World} world
 */
function updateTarget(world) {
  const target = new Query(world, [Position3D, Target]).single()
  const clock = world.getResource(VirtualClock)
  const dt = clock.getElapsed()
  const speed = 0.3
  const frequencyX = 3
  const frequencyY = 1
  const amplitudeX = 1.5
  const amplitudeY = 1.5

  if (!target) return

  const [position] = target

  position.x = amplitudeX * Math.cos(dt * frequencyX * speed)
  position.y = amplitudeY * Math.sin(dt * frequencyY * speed)
}

class Target { }
class Looker { }