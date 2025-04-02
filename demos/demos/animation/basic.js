import {
  Mesh,
  CanvasMeshedMaterial,
  createTransform2D,
  World,
  Color,
  Demo,
  Cleanup,
  AnimationClip,
  AnimationTrack,
  AnimationTarget,
  AnimationPlayer,
  PlaybackRepeat,
  Position2DAnimationEffector,
  Orientation2DAnimationEffector,
  Scale2DAnimationEffector
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
  const rawClip = createClip()
  const clip = clips.add('move', rawClip)
  const mesh = meshes.add('animation', Mesh.quad2D(50, 50))
  const material = materials.add('animation', new CanvasMeshedMaterial({
    fill: new Color(1, 1, 1)
  }))
  const targetname = '/bone'
  const animationplayer = new AnimationPlayer()
  
  animationplayer.set(clip, {
    duration: rawClip.duration,
    repeatMode: PlaybackRepeat.Forever
  })
  const player = commands
    .spawn()
    .insert(animationplayer)
    .build()
  
  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(120, 120),
      mesh,
      material,
      new AnimationTarget(player, targetname),
      new Cleanup()
    ])
    .build()
}

/**
 *
 */
function createClip() {
  const clip = new AnimationClip()
  
  const translate = new AnimationTrack(Position2DAnimationEffector)
  const rotate = new AnimationTrack(Orientation2DAnimationEffector)
  const scale = new AnimationTrack(Scale2DAnimationEffector)
  
  translate.times = [0, 2, 4, 6, 8]
  rotate.times = [0, 2, 4, 6, 8]
  scale.times = [0, 2, 4, 6, 8]
  
  translate.keyframes = [
    100,
    100,
    100,
    300,
    300,
    300,
    300,
    100,
    100,
    100
  ]
  rotate.keyframes = [
    0,
    Math.PI / 2,
    Math.PI,
    Math.PI * 3 / 2,
    Math.PI * 2
  ]
  scale.keyframes = [
    1,
    1,
    2,
    2,
    1,
    1,
    2,
    2,
    1,
    1
  ]
  
  clip.add('/bone', translate)
  clip.add('/bone', rotate)
  clip.add('/bone', scale)
  clip.calculateDuration()
  console.log(clip)
  
  return clip
}