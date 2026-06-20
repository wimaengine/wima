import {
  Mesh,
  createBasicMesh2D,
  createMovable2D,
  World,
  EntityCommands,
  BasicMaterial,
  Scene,
  SceneInstance,
  SceneAssets,
  Assets,
  Entity,
  Query,
  MeshAssets,
  BasicMaterialAssets,
  Color,
  AppSchedule,
  Rotation2D,
  rand,
  RelationshipQuery,
  Children,
  Parent,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  App,
  Angular2DDamping,
  Torque2D
} from 'wima'
import { addDefaultCamera2D, HackPlugin, setupViewport } from '../../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem({ schedule: AppSchedule.Update, system: applyRandomDescendantTorque })
  .registerSystem({ schedule: AppSchedule.Startup, system: init })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera2D })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = new EntityCommands(world)
  const angularDamping = world.getResource(Angular2DDamping)
  const scenes = world.getResource(SceneAssets)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const scene = scenes.add(createScene(meshes, materials))
  const instances = [
    { x: -0.5, y: -0.5 },
    { x: 0.5, y: -0.5 },
    { x: 0, y: 0.5 }
  ]

  for (let i = 0; i < instances.length; i++) {
    const { x, y } = instances[i]

    commands
      .spawn()
      .insertPrefab([...createMovable2D(x, y), new SceneInstance(scene)])
      .build()
  }

  angularDamping.value = 0
}

/**
 * @param {World} world
 */
function applyRandomDescendantTorque(world) {
  const roots = new Query(world, [Entity, SceneInstance])
  const descendants = new RelationshipQuery(world, Children, Parent, [Torque2D])

  roots.each(([entity]) => {
    descendants.treebfs(entity, ([torque]) => {
      torque.value = rand(-1.2, 1.2)
    })
  })
}

/**
 * @param {Assets<Mesh>} meshes
 * @param {Assets<BasicMaterial>} materials
 */
function createScene(meshes, materials) {
  const scene = new Scene()
  const mesh = meshes.add(Mesh.quad2D(0.05, 0.05))
  const material = materials.add(new BasicMaterial({
    color: new Color(1, 1, 1)
  }))

  const offsets = [
    { x: -0.05, y: -0.05 },
    { x: 0.05, y: -0.05 },
    { x: 0, y: 0.05 }
  ]

  for (let i = 0; i < offsets.length; i++) {
    scene.set(new Entity(i, 1), [
      ...createBasicMesh2D(mesh.clone(), material.clone(), offsets[i].x, offsets[i].y),
      new Rotation2D(),
      new Torque2D()
    ])
  }

  mesh.drop()
  material.drop()

  return scene
}
