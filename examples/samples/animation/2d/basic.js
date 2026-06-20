import {
  Mesh,
  createBasicMesh2D,
  World,
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
  HALF_PI,
  PI,
  TAU,
  AnimationClipAssets,
  AppSchedule,
  AnimationPlugin,
  App,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger
} from 'wima'
import { addDefaultCamera2D, HackPlugin, setupViewport } from '../../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new AnimationPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem({ schedule: AppSchedule.Startup, system: init })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera2D })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = new EntityCommands(world)
  const clips = world.getResource(AnimationClipAssets)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const rawClip = createClip()
  const clip = clips.add(rawClip)
  const mesh = meshes.add(Mesh.quad2D(0.15, 0.15))
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
      ...createBasicMesh2D(mesh, material, 0.3, 0.3),
      new AnimationTarget(player, targetname)])
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
    -0.5,
    0.5,
    -0.5,
    -0.5,
    0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    0.5
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
