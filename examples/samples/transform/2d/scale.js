import {
  BasicMaterial,
  Mesh,
  Scale2D,
  World,
  Query,
  EntityCommands,
  VirtualClock,
  Meshed,
  createBasicMesh2D,
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

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem({ schedule: AppSchedule.Startup, system: addmesh })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera2D })
  .registerSystem({ schedule: AppSchedule.Update, system: updateMesh })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function addmesh(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.quad2D(0.25, 0.25))
  const material = materials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh2D(mesh, material)])
    .build()
}

/**
 * @param {World} world
 */
function updateMesh(world) {
  const query = new Query(world, [Scale2D, Meshed])
  const clock = world.getResource(VirtualClock)
  const dt = clock.getElapsed()

  query.each(([scale]) => {
    scale.x = 1 + Math.sin(dt) * 0.5
    scale.y = 1 + Math.sin(dt) * 0.5
  })
}
