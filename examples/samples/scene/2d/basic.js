import {
  Mesh,
  createBasicMesh2D,
  World,
  EntityCommands,
  BasicMaterial,
  Scene,
  SceneInstance,
  SceneAssets,
  Assets,
  EntityHandle,
  createCamera2D,
  MeshAssets,
  BasicMaterialAssets,
  Color,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  App
} from 'wima'
import { HackPlugin, setupViewport } from '../../utils.js'

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
  .registerSystem({ schedule: AppSchedule.Startup, system: init })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = new EntityCommands(world)
  const scenes = world.getResource(SceneAssets)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const scene = scenes.add(createScene(meshes, materials))

  commands
    .spawn()
    .insertPrefab([
      new SceneInstance(scene)])
    .build()
}

/**
 * @param {Assets<Mesh>} meshes
 * @param {Assets<BasicMaterial>} materials
 */
function createScene(meshes, materials) {
  const scene = new Scene()

  const width = 1000
  const height = 600
  const halfWidth = width / 2
  const halfHeight = height / 2
  const mesh = meshes.add(Mesh.quad2D(
    itemHeight - paddingWidth,
    itemWidth - paddingHeight
  ))
  const material = materials.add(new BasicMaterial({
    color:new Color(1, 1, 0)
  }))

  let index = 0

  // Adds the entities to the scene
  for (let y = -halfHeight; y <= halfHeight; y += itemHeight) {
    for (let x = -halfWidth; x < halfWidth; x += itemWidth) {
      scene.set(new EntityHandle(index, 1), [
        ...createBasicMesh2D(mesh.clone(), material.clone(), x, y)])
      index += 1
    }
  }

  scene.set(new EntityHandle(index, 1), [...createCamera2D()])

  // We drop these since they are unused.
  mesh.drop()
  material.drop()

  return scene
}
