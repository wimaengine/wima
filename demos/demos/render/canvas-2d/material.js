import {
  Mesh,
  CanvasTextMaterial,
  CanvasImageMaterial,
  createTransform2D,
  World,
  Demo,
  Cleanup,
  EntityCommands,
  Material,
  Assets,
  typeidGeneric,
  BasicMaterial,
  Meshed,
  BasicMaterial2D
} from 'wima'
import { addDefaultCamera2D, BasicMaterialAssets, ImageAssets, MeshAssets } from '../../utils.js'

export default new Demo(
  'materials',
  [init, addDefaultCamera2D]
)

/**
 * @param {World} world
 */
export async function init(world) {

  /** @type {Assets<Material>}*/
  const materials = world.getResourceByTypeId(typeidGeneric(Assets, [Material]))
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const basicMaterials = world.getResource(BasicMaterialAssets)
  const images = world.getResource(ImageAssets)
  
  const mesh = meshes.add(Mesh.quad2D(50, 50))
  const material = basicMaterials.add(new BasicMaterial())
  const instancedMaterials = [
    materials.add(new CanvasTextMaterial({
      text: 'text is here',
      align: 'center'
    })),
    materials.add(new CanvasImageMaterial({
      image: images.load('assets/warrior.png'),
      width: 50,
      height: 50,
      divisionX: 7,
      divisionY: 11
    }))
  ]

  for (let i = 0; i < instancedMaterials.length; i++) {
    commands
      .spawn()
      .insertPrefab(createTransform2D(60 + 120 * i, 0))
      .insert(mesh)
      .insert(instancedMaterials[i])
      .insert(new Cleanup())
      .build()
  }

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(-120, 0),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Cleanup()
    ])
    .build()
}