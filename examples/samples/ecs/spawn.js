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
  Canvas2DRendererPlugin,
  App,
  AppSchedule,
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
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera2D })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerSystem({ schedule: AppSchedule.Update, system: update })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function update(world) {
  const commands = new EntityCommands(world)
  const entities = new Query(world, [EntityHandle, Marker])
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.quad2D(itemHeight - paddingWidth, itemWidth - paddingHeight))
  const material = materials.add(new BasicMaterial())

  const width = 1.8
  const height = 1.2
  const nx = Math.floor(width / (itemWidth + paddingWidth))
  const x = ((entities.count() % nx) * (itemWidth + paddingWidth)) - width / 2 + itemWidth / 2
  const y = Math.floor(entities.count() / nx) * (itemHeight + paddingHeight) - height / 2 + itemHeight / 2

  if (y > height / 2) return

  commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh2D(mesh, material, x, y),
      new Marker()])
    .build()
}
