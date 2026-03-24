import {
  Mesh,
  PerspectiveProjection,
  Camera,
  World,
  createCamera3D,
  EntityCommands,
  BasicMaterial,
  BasicMaterial3D,
  Meshed,
  createMovable3D,
  Query,
  Rotation3D,
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
  const commands = world.getResource(EntityCommands)
  const projection = new PerspectiveProjection()

  commands
    .spawn()
    .insertPrefab(createCamera3D(0, 0, 1))
    .insert(new Camera(projection))
    .build()
}

/**
 * @param {World} world
 */
function spawnMesh(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.triangle3D())
  const material = materials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createMovable3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material)])
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const rotable = new Query(world, [Rotation3D])

  rotable.each(([torque]) => {
    torque.y = Math.PI / 2
  })
}
