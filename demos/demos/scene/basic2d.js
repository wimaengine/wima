import {
  Mesh,
  createTransform2D,
  World,
  Demo,
  EntityCommands,
  Cleanup,
  BasicMaterial,
  Meshed,
  BasicMaterial2D,
  Scene,
  SceneInstance,
  SceneAssets,
  Assets,
  Entity,
  createCamera2D,
  MeshAssets,
  BasicMaterialAssets,
  Color
} from 'wima'

export default new Demo('scene/basic 2d', [init])

const itemWidth = 50
const itemHeight = 50
const paddingWidth = 10
const paddingHeight = 10

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const scenes = world.getResource(SceneAssets)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const scene = scenes.add(createScene(meshes,materials))
  commands
    .spawn()
    .insertPrefab([
      new SceneInstance(scene),
      new Cleanup()
    ])
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
    color:new Color(1,1,0)
  }))

  let index = 0
  // Adds the entities to the scene
  for (let y = -halfHeight; y <= halfHeight; y += itemHeight) {
    for (let x = -halfWidth; x < halfWidth; x += itemWidth) {
      scene.set(new Entity(index), [
        ...createTransform2D(x, y),
        new Meshed(mesh.clone()),
        new BasicMaterial2D(material.clone()),
        new Cleanup()
      ])
      index += 1
    }
  }
  scene.set(new Entity(index), [...createCamera2D(), new Cleanup()])
  // We drop these since they are unused.
  mesh.drop()
  material.drop()
  return scene
}
