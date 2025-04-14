import {
  Vector2,
  Position2DTween,
  Mesh,
  Easing,
  TweenRepeat,
  TweenFlip,
  createTransform2D,
  World,
  Query,
  CanvasTextMaterial,
  CanvasMeshedMaterial,
  Color,
  Demo,
  Cleanup,
  warn
} from 'wima'

export default new Demo('easing', [init])

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource('entitycommands')
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const window = new Query(world, ['window']).single()
  
  if(!window) return warn('No window is set up')

  const material = materials.add('easing', new CanvasMeshedMaterial({
    fill:new Color(255, 255, 255),
    stroke:new Color(255, 255, 255)
  }))
  const mesh = meshes.add('easing', Mesh.quad2D(50, 50))

  const offset = 100,
    stride = 100

  const easings = Object.keys(Easing)

  for (let i = offset; i < window[0].getWidth() - offset; i += stride) {
    const easeName = easings[(i - offset) / stride]
    
    commands
      .spawn()
      .insertPrefab(createTransform2D(i, 100))
      .insert(mesh)
      .insert(materials.add(easeName, new CanvasTextMaterial({
        text:easeName,
        align:'right'
      })))
      .insert(new Cleanup())
      .build()

    commands
      .spawn()
      .insertPrefab(createTransform2D(i, window[0].getHeight() / 2))
      .insert(material)
      .insert(mesh)
      .insert(new Position2DTween(
        new Vector2(i, 200),
        new Vector2(i, window[0].getHeight() / 2),
        4,
        true,
        true,
        Easing[easeName]
      ))
      .insertPrefab([new TweenRepeat(), new TweenFlip()])
      .insert(new Cleanup())
      .build()      
  }
}