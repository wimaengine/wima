import {
  BasicMaterial,
  Mesh,
  World,
  EntityCommands,
  createBasicMesh3D,
  createRawMovable3D,
  Rotation3D,
  Meshed,
  PI,
  Query,
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
  .registerSystem({ schedule: AppSchedule.Update, system: update })
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
      ...createBasicMesh3D(mesh, material),
      ...createRawMovable3D()])
    .insert(new Rotation3D(0, PI, 0))
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const query = new Query(world, [Rotation3D, Meshed])

  query.each(([rotation]) => {
    rotation.y = PI
  })
}
