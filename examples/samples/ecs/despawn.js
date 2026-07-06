import {
  Mesh,
  createBasicMesh2D,
  World,
  Query,
  EntityCommands,
  EntityHandle,
  BasicMaterial,
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

const itemWidth = 0.12
const itemHeight = 0.12
const paddingWidth = 0.03
const paddingHeight = 0.03
const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem({ schedule: AppSchedule.Startup, system: init })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera2D })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerSystem({ schedule: AppSchedule.Update, system: update })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const width = 1.8
  const height = 1.2
  const halfWidth = width / 2
  const halfHeight = height / 2
  const mesh = meshes.add(Mesh.quad2D(
    itemHeight - paddingWidth,
    itemWidth - paddingHeight
  ))
  const material = materials.add(new BasicMaterial())

  for (let y = -halfHeight + itemHeight / 2; y <= halfHeight - itemHeight / 2; y += itemHeight + paddingHeight) {
    for (let x = -halfWidth + itemWidth / 2; x <= halfWidth - itemWidth / 2; x += itemWidth + paddingWidth) {
      commands
        .spawn()
        .insertPrefab([
          ...createBasicMesh2D(mesh, material, x, y),
          new Marker()])
        .build()
    }
  }
}

/**
 * @param {World} world
 */
function update(world) {
  const commands = new EntityCommands(world)
  const entities = new Query(world, [EntityHandle, Marker])
  const entity = entities.single()

  if (!entity) return

  commands.despawn(entity[0])
}
