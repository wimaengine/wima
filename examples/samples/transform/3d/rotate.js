import {
  BasicMaterial,
  Mesh,
  World,
  EntityCommands,
  createMovable3D,
  Rotation3D,
  Meshed,
  BasicMaterial3D,
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
  .registerSystem(AppSchedule.Startup, spawnMesh)
  .registerSystem(AppSchedule.Startup, addDefaultCamera3D)
  .registerSystem(AppSchedule.Update, setupViewportWebgl)
  .registerSystem(AppSchedule.Update, update)
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
      ...createMovable3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material)])
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
