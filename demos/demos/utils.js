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
  ImageParser
} from 'wima'

// gizmo labels
export class Demo1 { }
export class Demo2 { }

/** @augments Gizmo2D<Demo1> */
export class Demo1Gizmo2D extends Gizmo2D { }

/** @augments Gizmo2D<Demo2> */
export class Demo2Gizmo2D extends Gizmo2D { }

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

export class ResourceAliasPlugin extends Plugin {

  /**
   * @param {App} app 
   */
  register(app) {
    const world = app.getWorld()

    world.setResourceAlias(typeidGeneric(Gizmo2D, [Demo1]), Demo1Gizmo2D)
    world.setResourceAlias(typeidGeneric(Gizmo2D, [Demo2]), Demo2Gizmo2D)

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