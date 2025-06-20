import {
  Mesh,
  CanvasMeshedMaterial,
  CanvasTextMaterial,
  CanvasImageMaterial,
  createTransform2D,
  World,
  Color,
  Demo,
  Cleanup,
  EntityCommands
} from 'wima'

export default new Demo('materials', [init])

/**
 * @param {World} world
 */
export async function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResourceByName('assets<mesh>')
  const materials = world.getResourceByName('assets<material>')
  const images = world.getResourceByName('assets<image>')

  const mesh = meshes.add('material', Mesh.quad2D(50, 50))
  
  const instancedMaterials = [
    materials.add('basic', new CanvasMeshedMaterial({
      fill:new Color(1, 1, 1)
    })),
    materials.add('text', new CanvasTextMaterial({
      text:'text is here',
      align:'center'
    })),
    materials.add('image', new CanvasImageMaterial({
      image:images.load('assets/warrior.png'),
      width:50,
      height:50,
      divisionX:7,
      divisionY:11
    }))
  ]

  for (let i = 0; i < instancedMaterials.length; i++) {
    commands
      .spawn()
      .insertPrefab(createTransform2D(60 + 120 * i, 120))
      .insert(mesh)
      .insert(instancedMaterials[i])
      .insert(new Cleanup())
      .build()
  }
}