import {
  Mesh,
  Color,
  World,
  Cleanup,
  EntityCommands,
  BasicMaterial,
  createTransform3D,
  BasicMaterial3D,
  Meshed,
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

class ChangeColor {
  color = new Color(0.003, 0.006, 0.012)
}

const MATERIAL_PATH = 'colorChange'
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
  .registerSystem(AppSchedule.Update, changeColor)
  .run()

/**
 * @param {World} world
 */
function spawnMesh(world) {
  world.setResource(new ChangeColor())
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.triangle3D())
  const material = materials.setWithUUID(MATERIAL_PATH, new BasicMaterial({
    color: new Color(1, 0, 0)
  }))

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
function changeColor(world) {
  const materials = world.getResource(BasicMaterialAssets)
  const color = world.getResource(ChangeColor)
  const material = materials.getByUUID(MATERIAL_PATH)

  if (!material) return

  if (
    material.color.r < 0 ||
    material.color.r + color.color.r > 1
  ) {
    color.color.r = -color.color.r
  }
  if (
    material.color.g < 0 ||
    material.color.g + color.color.g > 1
  ) {
    color.color.g = -color.color.g
  }
  if (
    material.color.b < 0 ||
    material.color.b + color.color.b > 1
  ) {
    color.color.b = -color.color.b
  }

  material.color.add(color.color)
}
