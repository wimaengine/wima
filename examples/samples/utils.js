import {
  World,
  Cleanup,
  AppSchedule,
  AssetServer,
  Assets,
  createCamera3D,
  EntityCommands,
  createCamera2D,
  Plugin,
  App,
  typeidGeneric,
  Gizmo2D,
  Audio,
  Image,
  Mesh,
  BasicMaterial,
  Parser,
  AudioParser,
  ImageParser,
  Query,
  WindowCommands,
  Entity,
  MainWindow,
  warn,
  Windows
} from 'wima'

/**
 * @param {World} world
 */
export function addDefaultCamera3D(world) {
  const commands = world.getResource(EntityCommands)

  commands
    .spawn()
    .insertPrefab([...createCamera3D(0, 0, 2), new Cleanup()])
    .build()
}

/**
 * @param {World} world
 */
export function addDefaultCamera2D(world) {
  const commands = world.getResource(EntityCommands)

  commands
    .spawn()
    .insertPrefab([...createCamera2D(), new Cleanup()])
    .build()
}

/**
 * @param {World} world
 */
export function setupViewport(world) {
  const windowcommands = world.getResource(WindowCommands)
  const window = new Query(world, [Entity, MainWindow]).single()

  if (!window) return warn('No main window defined.')

  windowcommands
    .window(window[0])
    .resize(innerWidth, innerHeight)
}

/**
* @param {World} world
*/
export function setupViewportWebgl(world) {
 const windowcommands = world.getResource(WindowCommands)
 const window = new Query(world, [Entity, MainWindow]).single()
 const canvases = world.getResource(Windows)
 const width = innerWidth
 const height = innerHeight

 if (!window) return warn('No main window defined.')

 const [entity] = window
 const canvas = canvases.getWindow(entity)

 if (!canvas) return

 const gl = canvas.getContext('webgl2')

 if (!gl) return

 gl.viewport(0, 0, width, height)
 windowcommands
   .window(entity)
   .resize(width, height)
}

// Sometimes features that are supposed to be there arent, this plugin
// provides some hacks to "just enable" code to work until they land.
export class HackPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    // HACK: This is a hack until system sets and ordering is introduced.
    {
      app
        .registerSystem(AppSchedule.Startup, registerAssetOnAssetServer(Audio))
        .registerSystem(AppSchedule.Startup, registerAssetOnAssetServer(Image))
        .registerSystem(AppSchedule.Startup, registerAssetOnAssetServer(Mesh))
        .registerSystem(AppSchedule.Startup, registerAssetOnAssetServer(BasicMaterial))
        .registerSystem(AppSchedule.Startup, registerAssetParserOnAssetServer(Audio, new AudioParser()))
        .registerSystem(AppSchedule.Startup, registerAssetParserOnAssetServer(Image, new ImageParser()))
    }
  }
}

/**
 * @template T
 * @param {new (...args:any[])=> T} type
 * @returns {(world:World)=>void}
 */
export function registerAssetOnAssetServer(type) {
  return function registerAssetOnAssetServer(world) {
    const server = world.getResource(AssetServer)
    const assets = world.getResourceByTypeId(typeidGeneric(Assets, [type]))

    server.registerAsset(assets)
  }
}

/**
 * @template T
 * @param {new (...args:any[])=> T} type
 * @param {Parser<T>} parser
 * @returns {(world:World)=>void}
 */
export function registerAssetParserOnAssetServer(type, parser) {
  return function registerAssetParsedOnAssetServer(world) {
    const server = world.getResource(AssetServer)

    server.registerParser(type, parser)
  }
}
