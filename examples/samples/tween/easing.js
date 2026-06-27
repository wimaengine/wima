import {
  Vector2,
  Position2DTween,
  Mesh,
  Easing,
  TweenRepeat,
  TweenFlip,
  createBasicMesh2D,
  World,
  EntityCommands,
  Assets,
  typeidGeneric,
  BasicMaterial,
  App,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger
} from 'wima'
import { addDefaultCamera2D, HackPlugin, setupViewport } from '../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
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

  /** @type {Assets<Mesh>}*/
  const meshes = world.getResourceByTypeId(typeidGeneric(Assets, [Mesh]))

  /** @type {Assets<BasicMaterial>}*/
  const basicMaterials = world.getResourceByTypeId(typeidGeneric(Assets, [BasicMaterial]))

  const material = basicMaterials.add(new BasicMaterial())
  const mesh = meshes.add(Mesh.quad2D(0.08, 0.08))

  const width = 1.8
  const startY = -0.7
  const endY = 0.7
  const easings = Object.keys(Easing)
  const stride = easings.length > 1 ? width / (easings.length - 1) : width
  const offset = -width / 2

  for (let i = 0; i < easings.length; i++) {
    const easeName = easings[i]
    const x = offset + i * stride
    const y = startY

    commands
      .spawn()
      .insertPrefab([
        ...createBasicMesh2D(mesh, material, x, y),
        new Position2DTween(
          new Vector2(x, y),
          new Vector2(x, endY),
          4,
          true,
          true,

          // @ts-ignore
          Easing[easeName]
        ),
        new TweenRepeat(),
        new TweenFlip()])
      .build()
  }
}
