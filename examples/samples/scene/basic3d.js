import {
  Mesh,
  World,
  EntityCommands,
  BasicMaterial,
  Meshed,
  Scene,
  SceneInstance,
  SceneAssets,
  Assets,
  BasicMaterial3D,
  createTransform3D,
  Entity,
  createCamera3D,
  MeshAssets,
  BasicMaterialAssets,
  Color,
  App,
  AppSchedule,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  WebglRendererPlugin
} from 'wima'
import { HackPlugin, setupViewportWebgl } from '../utils.js'

const itemWidth = 0.5
const itemHeight = 0.5
const itemDepth = 0.5
const paddingWidth = 0.2
const paddingHeight = 0.2
const paddingDepth = 0.2

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerDebugger(new FPSDebugger())
  .registerSystem(AppSchedule.Startup, init)
  .registerSystem(AppSchedule.Update, setupViewportWebgl)
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
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

  const width = 3
  const height = 3
  const depth = 3
  const halfWidth = width / 2
  const halfHeight = height / 2
  const halfDepth = depth / 2
  const mesh = meshes.add(Mesh.cube(
    itemHeight - paddingWidth,
    itemWidth - paddingHeight,
    itemDepth - paddingDepth
  ))
  const material = materials.add(new BasicMaterial({
    color: new Color(0, 1, 1)
  }))

  let index = 0

  // Adds the entities to the scene
  for (let x = -halfWidth; x <= halfWidth; x += itemWidth) {
    for (let y = -halfHeight; y <= halfHeight; y += itemHeight) {
      for (let z = -halfDepth; z <= halfDepth; z += itemDepth) {
        scene.set(new Entity(index, 1), [
          ...createTransform3D(x, y, z),
          new Meshed(mesh.clone()),
          new BasicMaterial3D(material.clone())])
        index += 1
      }
    }
  }

  scene.set(new Entity(index, 1), [...createCamera3D(0, 0, 5)])

  // We drop these since they are unused.
  mesh.drop()
  material.drop()

  return scene
}
