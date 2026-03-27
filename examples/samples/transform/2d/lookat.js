import {
  BasicMaterial,
  Mesh,
  World,
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
  HALF_PI,
  BasicMaterialAssets,
  MeshAssets,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger
} from 'wima'
import { addDefaultCamera2D, HackPlugin, setupViewport } from '../../utils.js'

class Target { }
class Looker { }

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem(AppSchedule.Startup, spawnLookers)
  .registerSystem(AppSchedule.Startup, spawnTarget)
  .registerSystem(AppSchedule.Startup, addDefaultCamera2D)
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerSystem(AppSchedule.Update, updateLookers)
  .registerSystem(AppSchedule.Update, updateTarget)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function spawnLookers(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.triangle2D(0.05, 0.15))
  const material = materials.add(new BasicMaterial())

  for (let x = -0.8; x <= 0.8; x += 0.4) {
    for (let y = -0.6; y <= 0.6; y += 0.4) {
      commands
        .spawn()
        .insertPrefab([
          ...createTransform2D(x, y),
          new Meshed(mesh),
          new BasicMaterial2D(material),
          new Looker()])
        .build()
    }

  }
}

/**
 * @param {World} world
 */
function spawnTarget(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.circle2D(0.05))
  const material = materials.add(new BasicMaterial({
    color:new Color(0, 1, 1)
  }))

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Target()])
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
  const offset = Rotary.fromAngle(-HALF_PI)

  lookers.each(([orientation, transform]) => {
    const position = new Vector2(
      transform.x,
      transform.y
    )
    const lookAt = Affine2.lookAt(position, targetPosition)

    // eslint-disable-next-line no-unused-vars
    const [_, finalOrientation] = lookAt.decompose()

    orientation.copy(finalOrientation.multiply(offset))
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
  const amplitudeX = 0.7
  const amplitudeY = 0.7

  if (!target) return

  const [position] = target

  position.x = amplitudeX * Math.cos(dt * frequencyX * speed)
  position.y = amplitudeY * Math.sin(dt * frequencyY * speed)
}
