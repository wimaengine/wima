import {
  Mesh,
  createTransform2D,
  World,
  Demo,
  Cleanup,
  AnimationClip,
  AnimationTrack,
  AnimationTarget,
  AnimationPlayer,
  PlaybackRepeat,
  Position2DAnimationEffector,
  Orientation2DAnimationEffector,
  Scale2DAnimationEffector,
  EntityCommands,
  MeshAssets,
  BasicMaterialAssets,
  BasicMaterial,
  Meshed,
  BasicMaterial2D,
  HALF_PI,
  PI,
  TAU
} from 'wima'
import { AnimationClipAssets } from '../../../src/animation/resources/aliases.js'
import { addDefaultCamera2D } from '../utils.js'

export default new Demo('basic animation', [init, addDefaultCamera2D])

/**
 * @param {World} world
 */
export function init(world) {
  const commands = world.getResource(EntityCommands)
  const clips = world.getResource(AnimationClipAssets)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const rawClip = createClip()
  const clip = clips.add(rawClip)
  const mesh = meshes.add(Mesh.quad2D(50, 50))
  const material = materials.add(new BasicMaterial())  
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
      ...createTransform2D(100, 100),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new AnimationTarget(player, targetname),
      new Cleanup()
    ])
    .build()
}

/**
 *@returns {AnimationClip}
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
    -100,
    100,
    -100,
    -100,
    100,
    -100,
    100,
    100,
    -100,
    100
  ]
  rotate.keyframes = [
    0,
    HALF_PI,
    PI,
    HALF_PI * 3,
    TAU
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
  
  return clip
}