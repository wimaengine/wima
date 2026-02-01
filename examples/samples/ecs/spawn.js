import {
  Mesh,
  createTransform2D,
  World,
  Query,
  EntityCommands,
  Cleanup,
  Entity,
  BasicMaterial,
  Meshed,
  BasicMaterial2D,
  BasicMaterialAssets,
  MeshAssets,
  Canvas2DRendererPlugin,
  App,
  AppSchedule,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger
} from 'wima'
import { addDefaultCamera2D, HackPlugin, setupViewport } from '../utils.js'

class Marker { }

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10
const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem(AppSchedule.Startup, addDefaultCamera2D)
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerSystem(AppSchedule.Update, update)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function update(world) {
  const commands = world.getResource(EntityCommands)
  const entities = new Query(world, [Entity, Marker])
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.quad2D(itemHeight - paddingWidth, itemWidth - paddingHeight))
  const material = materials.add(new BasicMaterial())

  const width = 1000
  const height = 600
  const nx = Math.floor(width / itemWidth)
  const x = ((entities.count() % nx) * itemWidth) - width / 2
  const y = Math.floor(entities.count() / nx) * itemHeight - height / 2

  if (y > height / 2) return

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(x, y),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Marker(),
      new Cleanup()
    ])
    .build()
}
