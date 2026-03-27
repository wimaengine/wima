import {
  Mesh,
  Rotation3D,
  World,
  createCamera3D,
  EntityCommands,
  BasicMaterial,
  createTransform3D,
  Meshed,
  BasicMaterial3D,
  createRawMovable3D,
  Query,
  BasicMaterialAssets,
  MeshAssets,
  App,
  AppSchedule,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  WebglRendererPlugin
} from 'wima'
import { HackPlugin, setupViewportWebgl } from '../../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerDebugger(new FPSDebugger())
  .registerSystem(AppSchedule.Startup, spawnMesh)
  .registerSystem(AppSchedule.Startup, addCamera3D)
  .registerSystem(AppSchedule.Update, setupViewportWebgl)
  .registerSystem(AppSchedule.Update, update)
  .run()

/**
 * @param {World} world
 */
function addCamera3D(world) {
  const commands = new EntityCommands(world)

  commands
    .spawn()
    .insertPrefab([
      ...createCamera3D(0, 0, 1)])
    .insertPrefab(createRawMovable3D())
    .insert(new Rotation3D())
    .build()
}

/**
 * @param {World} world
 */
function spawnMesh(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.triangle3D())
  const material = materials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createTransform3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material)])
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const rotable = new Query(world, [Rotation3D])

  rotable.each(([rotation]) => {
    rotation.y = Math.PI / 4
  })
}
