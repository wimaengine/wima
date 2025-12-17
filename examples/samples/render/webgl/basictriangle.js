import {
  Demo,
  Mesh,
  World,
  Cleanup,
  EntityCommands,
  createTransform3D,
  BasicMaterial,
  Meshed,
  BasicMaterial3D,
  BasicMaterialAssets,
  MeshAssets,
  App,
  AppSchedule,
  DOMWindowPlugin,
  DefaultPlugin,
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