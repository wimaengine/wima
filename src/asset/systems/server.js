/** @import { SystemFunc, World } from '../../ecs/index.js' */
/** @import { Constructor } from '../../reflect/index.js' */
/** @import { AssetDropped, AssetEvent, Parser } from '../index.js' */
import { typeidGeneric } from '../../reflect/index.js'
import { Assets } from '../core/index.js'
import { AssetServer } from '../resources/index.js'

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