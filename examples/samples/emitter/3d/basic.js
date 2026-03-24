import {
  Mesh,
  World,
  Query,
  EntityCommands,
  Emitter,
  Touches,
  Device,
  PlatformOS,
  MouseButtons,
  MouseButton,
  BasicMaterial,
  Meshed,
  MeshAssets,
  BasicMaterialAssets,
  createMovable3D,
  BasicMaterial3D,
  Entity,
  Rotation3D,
  Velocity3D,
  Acceleration3D,
  GlobalTransform3D,
  Orientation3D,
  Position3D,
  Scale3D,
  Torque3D,
  rand,
  Range,
  createEmitter3D,
  Timer,
  App,
  AppSchedule,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  WebglRendererPlugin,
  Emitter3DPlugin
} from 'wima'
import { addDefaultCamera3D, HackPlugin, setupViewportWebgl } from '../../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Emitter3DPlugin())
  .registerSystem(AppSchedule.Startup, init)
  .registerSystem(AppSchedule.Startup, addDefaultCamera3D)
  .registerSystem(AppSchedule.Update, setupViewportWebgl)
  .registerSystem(AppSchedule.Update, update)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.cube(0.2, 0.2, 0.2))
  const material = materials.add(new BasicMaterial())

  /**
   *@returns {[Position3D, Orientation3D, Scale3D, GlobalTransform3D, Velocity3D, Rotation3D, Acceleration3D, Torque3D, Meshed, BasicMaterial3D]}
   */
  function particle() {
    return [
      ...createMovable3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material)]
  }

  /**
   * @param {EntityCommands} commands
   * @param {Entity} entity
   */
  function patch(commands, entity) {
    commands
      .entity(entity)
      .insertPrefab([
        new Velocity3D(0, 1),
        new Rotation3D(0, 0, rand(-5, 5))
      ])
      .build()
  }

  commands
    .spawn()
    .insertPrefab([
      ...createEmitter3D({
        lifetime:new Range(6, 8),
        prefab: particle,
        patch
      })])
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const emitters = new Query(world, [Timer, Emitter])
  const touches = world.getResource(Touches)
  const mouse = world.getResource(MouseButtons)
  const device = world.getResource(Device)

  if (device.platform === PlatformOS.Android || device.platform === PlatformOS.Ios) {
    const touch = touches.getFirst()

    if (!touch) return
  } else {
    if (!mouse.justPressed(MouseButton.Left)) {
      return
    }
  }

  emitters.each(([timer]) => {
    timer.reset()
  })
}
