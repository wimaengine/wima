import {
  World,
  AssetServer,
  Assets,
  createCamera3D,
  EntityCommands,
  createCamera2D,
  Plugin,
  typeidGeneric,
  Query,
  WindowCommands,
  EntityHandle,
  MainWindow,
  Vector2,
  warn,
  Windows
} from 'wima'

/**
 * @param {World} world
 */
export function addDefaultCamera3D(world) {
  const commands = new EntityCommands(world)

  commands
    .spawn()
    .insertPrefab([...createCamera3D(0, 0, 2)])
    .build()
}

/**
 * @param {World} world
 */
export function addDefaultCamera2D(world) {
  const commands = new EntityCommands(world)

  commands
    .spawn()
    .insertPrefab([...createCamera2D()])
    .build()
}

/**
 * @param {World} world
 */
export function setupViewport(world) {
  const windowcommands = new WindowCommands(world)
  const window = new Query(world, [EntityHandle, MainWindow]).single()

  if (!window) return warn('No main window defined.')

  windowcommands
    .window(window[0])
    .resize(innerWidth, innerHeight)
}

/**
 * @param {World} world
 */
export function setupViewportWebgl(world) {
  const windowcommands = new WindowCommands(world)
  const window = new Query(world, [EntityHandle, MainWindow]).single()
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
// TODO: Remove this
export class HackPlugin extends Plugin {}

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
 * Convert a pixel-space coordinate (origin top-left) to NDC (-1..1, Y up).
 *
 * @param {number} x
 * @param {number} y
 * @param {number} [width]
 * @param {number} [height]
 * @returns {Vector2}
 */
export function pxToNdc(x, y, width = innerWidth, height = innerHeight) {
  return new Vector2(
    (x / (width / 2)) - 1,
    1 - (y / (height / 2))
  )
}

/**
 * Convert an NDC coordinate (-1..1, Y up) to pixel-space (origin top-left).
 *
 * @param {number} x
 * @param {number} y
 * @param {number} [width]
 * @param {number} [height]
 * @returns {Vector2}
 */
export function ndcToPx(x, y, width = innerWidth, height = innerHeight) {
  return new Vector2(
    (x + 1) * (width / 2),
    (1 - y) * (height / 2)
  )
}
