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
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
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
  .registerSystem(AppSchedule.Startup, init)
  .registerSystem(AppSchedule.Startup, addDefaultCamera2D)
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerSystem(AppSchedule.Update, update)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const width = 1000
  const height = 600
  const halfWidth = width / 2
  const halfHeight = height / 2
  const mesh = meshes.add(Mesh.quad2D(
    itemHeight - paddingWidth,
    itemWidth - paddingHeight
  ))
  const material = materials.add(new BasicMaterial())

  for (let y = -halfHeight; y <= halfHeight; y += itemHeight) {
    for (let x = -halfWidth; x < halfWidth; x += itemWidth) {
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
  }
}

/**
 * @param {World} world
 */
function update(world) {
  const commands = world.getResource(EntityCommands)
  const entities = new Query(world, [Entity, Marker])
  const entity = entities.single()

  if (!entity) return

  commands.despawn(entity[0])
}
