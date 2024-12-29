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
  AnimationClip,
  AnimationTrack,
  AnimationTarget
} from 'chaosstudio'

export const animation = new Demo('basic animation', [init])

/**
 * @param {World} world
 */
export function init(world) {
  const commands = world.getResource('entitycommands')
  const clips = world.getResource('assets<animationclip>')
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')
  const images = world.getResource('assets<image>')
  const clip = clips.add("move", createClip())

  const mesh = meshes.add('animation', Mesh.quad2D(50, 50))
  const material = materials.add('animation', new CanvasMeshedMaterial({
    fill: new Color(1, 1, 1)
  }))
  const targetname = "/bone"
  const animationplayer = new AnimationPlayer()
  const player = commands
    .spawn()
    .insert(animationplayer)
    .build()
  commands
    .spawn()
    .insertPrefab(createTransform2D(120, 120))
    .insert(mesh)
    .insert(material)
    .insert(new Cleanup())
    .insert(new AnimationTarget(player))
    .build()
}

function createClip() {
  const clip = new AnimationClip()

  const translate = new AnimationTrack()

  return clip
}