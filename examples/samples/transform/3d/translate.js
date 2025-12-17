import {
  BasicMaterial,
  Mesh,
  Position3D,
  World,
  Cleanup,
  Query,
  EntityCommands,
  VirtualClock,
  BasicMaterial3D,
  Meshed,
  createTransform3D,
  BasicMaterialAssets,
  MeshAssets,
  App,
  AppSchedule,
  DOMWindowPlugin,
  DefaultPlugin,
  FPSDebugger,
  WebglRendererPlugin
} from 'wima'
import { addDefaultCamera3D, HackPlugin, setupViewport, setupViewportWebgl } from '../../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerDebugger(new FPSDebugger())
  .registerSystem(AppSchedule.Startup, spawnMesh)
  .registerSystem(AppSchedule.Startup, addDefaultCamera3D)
  .registerSystem(AppSchedule.Update, setupViewportWebgl)
  .registerSystem(AppSchedule.Update, updateMesh)
  .run()

/**
 * @param {World} world
 */
function spawnMesh(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.triangle3D())
  const material = materials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createTransform3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new Cleanup()
    ])
    .build()
}

/**
 * @param {World} world
 */
function updateMesh(world) {
  const query = new Query(world, [Position3D, Meshed])
  const clock = world.getResource(VirtualClock)
  const dt = clock.getElapsed()

  query.each(([position]) => {
    position.x = Math.sin(dt) * 0.5
    position.y = Math.cos(dt) * 0.5
    position.z = -2
  })
}
