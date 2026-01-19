/** @import { SystemFunc, World } from '../../ecs/index.js' */
/** @import { Constructor } from '../../reflect/index.js' */
/** @import { AssetDropped, AssetEvent, Parser } from '../index.js' */
import { Events } from '../../event/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { Assets } from '../core/index.js'
import { AssetServer } from '../resources/index.js'
import { AssetLoadFail } from '../events/index.js'
import { error } from '../../logger/index.js'

/**
 * @template T
 * @param {Constructor<T>} type
 * @returns {SystemFunc}
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
 * @param {Constructor<T>} type
 * @param {Parser<T>} parser
 * @returns {SystemFunc}
 */
export function registerAssetParserOnAssetServer(type, parser) {
  return function registerAssetParsedOnAssetServer(world) {
    const server = world.getResource(AssetServer)

    server.registerParser(type, parser)
  }
}

/**
 * @param {World} world
 */
export function updateAssets(world) {
  const server = world.getResource(AssetServer)
  const loaded = server.flushLoadedAssets()

  for (let i = 0; i < loaded.length; i++) {
    const { asset, typeId, assetId } = loaded[i]
    const assets = server.getAssets(typeId)

    if (!assets) continue

    assets.setUsingAssetId(assetId, asset)
  }
}

/**
 * @param {World} world
 */
export function logFailedLoads(world) {

  /** @type {Events<AssetLoadFail>} */
  const events = world.getResourceByTypeId(typeidGeneric(Events, [AssetLoadFail]))

  events.each((event) => {
    const { data } = event

    error(`\`AssetServer\` error loading "${data.path}": ${data.reason}`)
  })
}

/**
 * @template T
 * @template {AssetDropped<T>} U
 * @param {Constructor<U>} dropEvent
 * @returns {SystemFunc}
 */
export function unloadDroppedAssets(dropEvent) {
  return function unloadDroppedAssets(world) {

    /** @type {Events<U>} */
    const events = world.getResourceByTypeId(typeidGeneric(Events, [dropEvent]))
    const server = world.getResource(AssetServer)

    events.each((event) => {
      const { data } = event

      server.dropAssetInfo(data.id)
    })
  }
}
