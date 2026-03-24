import {
  Mesh,
  createTransform2D,
  World,
  Color,
  Query,
  EntityCommands,
  warn,
  Touches,
  Entity,
  Position2D,
  BasicMaterial,
  BasicMaterial2D,
  Meshed,
  BasicMaterialAssets,
  MeshAssets,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger
} from 'wima'
import { addDefaultCamera2D, HackPlugin, setupViewport, pxToNdc } from '../utils.js'

/** @type {Map<number,Entity>} */
class TouchtoEntityMap extends Map { }

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
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)
  const map = new TouchtoEntityMap()
  const commands = world.getResource(EntityCommands)

  if (!window) return warn('No window set up')

  const mesh = meshes.add(Mesh.quad2D(0.1, 0.1))

  for (let i = 0; i < 10; i++) {
    const entity = commands
      .spawn()
      .insertPrefab([
        ...createTransform2D(0, 0),
        new Meshed(mesh),
        new BasicMaterial2D(materials.add(new BasicMaterial({
          color: Color.WHITE.clone()
        })))])
      .build()

    map.set(i, entity)

  }

  world.setResource(map)
}

/**
 * @param {World} world
 */
function update(world) {
  const materials = world.getResource(BasicMaterialAssets)
  const touches = world.getResource(Touches)
  const map = world.getResource(TouchtoEntityMap)
  const entities = new Query(world, [Position2D, BasicMaterial2D])

  map.forEach((id, key) => {
    const touch = touches.get(key)
    const components = entities.get(id)

    if (!components) return

    const material = materials.get(components[1].handle)

    if (!material) return

    if (touch) {
      components[0].copy(pxToNdc(touch.position.x, touch.position.y))
      material.color.copy(Color.RED)
    } else {
      material.color.copy(Color.WHITE)
    }
  })
}
