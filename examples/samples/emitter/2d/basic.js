import {
  Mesh,
  World,
  Query,
  EntityCommands,
  Emitter,
  createEmitter2D,
  Touches,
  Device,
  PlatformOS,
  MouseButtons,
  MouseButton,
  BasicMaterial,
  Meshed,
  BasicMaterialInstance,
  MeshAssets,
  BasicMaterialAssets,
  createBasicMesh2D,
  createRawMovable2D,
  Position2D,
  Orientation2D,
  Acceleration2D,
  GlobalTransform2D,
  Rotation2D,
  Scale2D,
  Torque2D,
  Velocity2D,
  EntityHandle,
  rand,
  HALF_PI,
  Timer,
  has,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  Emitter2DPlugin
} from 'wima'
import { addDefaultCamera2D, HackPlugin, setupViewport } from '../../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerPlugin(new Emitter2DPlugin())
  .registerSystem({ schedule: AppSchedule.Startup, system: init })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera2D })
  .registerSystem({ schedule: AppSchedule.Update, system: update })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.quad2D(0.08, 0.08))
  const material = materials.add(new BasicMaterial())

  /**
   *@returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D, Meshed, BasicMaterialInstance, Velocity2D, Rotation2D, Acceleration2D, Torque2D]}
   */
  function particle() {
    return [
      ...createBasicMesh2D(mesh.clone(), material.clone()),
      ...createRawMovable2D()]
  }

  /**
   * @param {EntityCommands} commands
   * @param {EntityHandle} entity
   */
  function patch(commands, entity) {
    commands
      .entity(entity)
      .insertPrefab([
        new Velocity2D(rand(0.3, 0.6)),
        new Rotation2D(rand(-HALF_PI, HALF_PI))
      ])
      .build()
  }

  commands
    .spawn()
    .insertPrefab([
      ...createEmitter2D({
        prefab: particle,
        patch
      })])
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const emitters = new Query(world, [Timer], [has(Emitter)])
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
