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
  Color,
  BasicMaterialAssets,
  MeshAssets,
  App,
  AppSchedule,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  WebglRendererPlugin
} from 'wima'
import { addDefaultCamera3D, HackPlugin, setupViewport, setupViewportWebgl } from '../../utils.js'


class Target { }
class Looker { }

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerDebugger(new FPSDebugger())
  .registerSystem(AppSchedule.Startup, spawnLookers)
  .registerSystem(AppSchedule.Startup, spawnTarget)
  .registerSystem(AppSchedule.Startup, addDefaultCamera3D)
  .registerSystem(AppSchedule.Update, setupViewportWebgl)
  .registerSystem(AppSchedule.Update, updateLookers)
  .registerSystem(AppSchedule.Update, updateTarget)
  .run()

/**
 * @param {World} world
 */
function spawnLookers(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.cube(0.03, 0.03, 0.1))
  const material = materials.add(new BasicMaterial())

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
function spawnTarget(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.cube(0.05, 0.05, 0.05))
  const material = materials.add(new BasicMaterial({
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
