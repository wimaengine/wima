import {
  Mesh,
  createTransform2D,
  World,
  EntityCommands,
  BasicMaterial,
  Meshed,
  BasicMaterial2D,
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
  .registerSystem(AppSchedule.Startup, init)
  .registerSystem(AppSchedule.Startup, addDefaultCamera2D)
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const basicMaterials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.quad2D(0.2, 0.2))
  const material = basicMaterials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(-0.5, 0),
      new Meshed(mesh),
      new BasicMaterial2D(material)])
    .build()
}
