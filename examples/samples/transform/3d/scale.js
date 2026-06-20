import {
  BasicMaterial,
  Mesh,
  Scale3D,
  World,
  Query,
  EntityCommands,
  VirtualClock,
  Meshed,
  createBasicMesh3D,
  BasicMaterialAssets,
  MeshAssets,
  App,
  AppSchedule,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  WebglRendererPlugin
} from 'wima'
import { addDefaultCamera3D, HackPlugin, setupViewportWebgl } from '../../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerDebugger(new FPSDebugger())
  .registerSystem({ schedule: AppSchedule.Startup, system: spawnMesh })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera3D })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewportWebgl })
  .registerSystem({ schedule: AppSchedule.Update, system: updateMesh })
  .run()

/**
 * @param {World} world
 */
function spawnMesh(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.triangle3D())
  const material = materials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh3D(mesh, material)])
    .build()
}

/**
 * @param {World} world
 */
function updateMesh(world) {
  const query = new Query(world, [Scale3D, Meshed])
  const clock = world.getResource(VirtualClock)
  const dt = clock.getElapsed()

  query.each(([scale]) => {
    scale.x = 1 + Math.sin(dt) * 0.5
    scale.y = 1 + Math.sin(dt) * 0.5
  })
}
