/** @import { TypeId, Constructor } from '../../reflect/index.js' */
/** @import { AssetId } from '../types/index.js' */
import { typeid } from '../../reflect/index.js'
import { assert } from '../../logger/index.js'
import { getFileExtension, swapRemove } from '../../utils/index.js'
import { Assets, Handle, Parser } from '../core/index.js'
import { AssetLoadSuccess, AssetLoadFail } from '../events/index.js'

export class AssetServer {

  /**
   * @readonly
   * @private
   * @type {AssetInfos}
   */
  assetInfos = new AssetInfos()

  /**
   * @private
   * @readonly
   * @type {Map<TypeId, Parser<unknown>>}
   */
  parsers = new Map()

  /**
   * @private
   * @readonly
   * @type {Map<TypeId, string>}
   */
  basePaths = new Map()

  /**
   * @private
   * @readonly
   * @type {Map<TypeId, Assets<unknown>>}
   */
  assets = new Map()

  /**
   * @private
   * @type {UntypedAsset[]}
   */
  loadedAssets = []

  /**
   * @private
   * @type {AssetLoadSuccess[]}
   */
  loaded = []

  /**
   * @type {AssetLoadFail[]}
   */
  failed = []

  /**
   * @template T
   * @param {Assets<T>} assets
   */
  registerAsset(assets) {
    const typeId = typeid(assets.type)

    this.assets.set(typeId, assets)
  }

  /**
   * @template T
   * @param {Constructor<T>} type 
   * @param {Parser<T>} parser
   */
  registerParser(type, parser) {
    this.parsers.set(typeid(type), parser)
  }

  /**
   * @template T
   * @param {Constructor<T>} type
   * @param {string} path
   * @returns {Handle<T>}
   */
  load(type, path) {
    const typeId = typeid(type)
    const baseUrl = this.basePaths.get(typeId) || ''
    const completePath = baseUrl + path
    const assets = this.assets.get(typeId)

    assert(assets, `No assets registered for the asset type \`${type.name}\` on \`AssetServer\``)

    const assetInfo = this.assetInfos.getByPath(completePath)

    if (assetInfo) {

      // SAFETY: handle is generated from `Assets` backing `T`
      return /** @type {Handle<T>} */ (assets.upgrade(assetInfo.id))
    }

    // SAFETY: handle is generated from `Assets` backing `T`
    const handle = /** @type {Handle<T>} */ (assets.reserve())
    const assetId = handle.id()
    const newAssetInfo = new AssetInfo(completePath, assetId)

    this.assetInfos.add(newAssetInfo)
    this.fetch(assetId, typeId, completePath, newAssetInfo)

    return handle
  }

  /**
   * @param {AssetId} assetId
   * @param {TypeId} typeId
   * @param {string} path
   * @param {AssetInfo} info
   */
  async fetch(assetId, typeId, path, info) {
    try {
      const asset = await this.internalFetch(assetId, typeId, path)

      this.loaded.push(new AssetLoadSuccess(typeId, assetId, path))
      this.loadedAssets.push(asset)
      info.loadstate = LoadState.Loaded
    } catch(error) {
      let message = ''

      if (typeof error === 'string') {
        message = error
      } else if (error instanceof Error) {
        
        // eslint-disable-next-line prefer-destructuring
        message = error.message
      } else {
        console.error('Unhandled Error: ', error)
      }

      this.failed.push(new AssetLoadFail(
        typeId,
        assetId,
        path,
        message
      ))
      info.loadstate = LoadState.Failed
    }
  }

  /**
   * @private
   * @param {AssetId} assetId
   * @param {TypeId} typeId
   * @param {string} path
   * @throws {string | Error}
   * @returns {Promise<UntypedAsset>}
   */
  async internalFetch(assetId, typeId, path) {
    const extension = getFileExtension(path)
    const parser = this.parsers.get(typeId)

    if (!parser) {
      throw 'No parser registered for the asset type.'
    }

    if (!parser.verify(extension)) {
      throw `The extension "${extension}" is not supported by \`${parser.constructor.name}\``
    }

    const response = await fetch(path)

    if (!response.ok) {
      throw response.statusText
    }

    const result = await parser.parse(response)

    if (!result) {
      throw 'Could not parse the asset.'
    }

    return new UntypedAsset(typeId, assetId, result)
  }

  /**
   * @param {TypeId} typeId
   * @returns {Assets<unknown>}
   */
  getAssets(typeId) {
    return this.assets.get(typeId)
  }

  /**
   * @template T
   * @param {Handle<T>} handle
   */
  getAssetInfo(handle) {
    return this.getAssetInfoByAssetId(handle.id())
  }

  /**
   * @param {AssetId} assetId
   */
  getAssetInfoByAssetId(assetId) {
    return this.assetInfos.getByAssetId(assetId)
  }

  /**
   * @param {string} path
   */
  getAssetInfoByPath(path) {
    return this.assetInfos.getByPath(path)
  }

  /**
   * @param {AssetId} id
   */
  dropAssetInfo(id) {
    this.assetInfos.delete(id)
  }

  /**
   * @returns {readonly AssetLoadSuccess[]}
   */
  flushLoadSuccess() {
    const buffer = this.loaded

    this.loaded = []

    return buffer
  }

  /**
   * @returns {readonly AssetLoadFail[]}
   */
  flushLoadFail() {
    const buffer = this.failed

    this.failed = []

    return buffer
  }

  /**
   * @returns {readonly UntypedAsset[]}
   */
  flushLoadedAssets() {
    const buffer = this.loadedAssets

    this.loadedAssets = []

    return buffer
  }
}

class UntypedAsset {

  /**
   * @readonly
   * @type {TypeId}
   */
  typeId

  /**
   * @readonly
   * @type {AssetId}
   */
  assetId

  /**
   * @readonly
   * @type {unknown}
   */
  asset

  /**
   * @param {TypeId} typeId
   * @param {AssetId} assetId
   * @param {unknown} asset 
   */
  constructor(typeId, assetId, asset) {
    this.typeId = typeId
    this.asset = asset
    this.assetId = assetId
  }
}

class AssetInfo {

  /**
   * @readonly
   * @type {AssetId}
   */
  id

  /**
   * @type {LoadState}
   */
  loadstate = LoadState.Loading

  /**
   * @type {string}
   */
  path

  /**
   * @param {string} path
   * @param {AssetId} assetId
   */
  constructor(path, assetId) {
    this.path = path
    this.id = assetId
  }
}

class AssetInfos {

  /**
   * @private
   * @type {AssetInfo[]}
   */
  assets = []

  /**
   * @private
   * @type {Map<AssetId,number>}
   */
  assetIds = new Map()

  /**
   * @private
   * @type {Map<string,number>}
   */
  paths = new Map()

  /**
   * @param {AssetInfo} info
   */
  add(info) {
    const { path, id } = info
    const index = this.assets.length

    this.assets.push(info)
    this.assetIds.set(id, index)
    this.paths.set(path, index)
  }

  /**
   * @param {string} path
   */
  getByPath(path) {
    const index = this.paths.get(path)

    return this.getByIndex(index)
  }

  /**
   * @param {AssetId} assetId
   */
  getByAssetId(assetId) {
    const index = this.assetIds.get(assetId)

    return this.getByIndex(index)

  }

  /**
   * @param {number} index
   * @returns {AssetInfo | undefined}
   */
  getByIndex(index) {
    return this.assets[index]
  }

  size() {
    return this.assets.length
  }

  /**
   * @param {AssetId} id
   */
  delete(id) {
    const index = this.assetIds.get(id)

    if (index === undefined) return

    const oldInfo = this.getByIndex(index)

    if (!oldInfo) return

    this.assetIds.delete(id)
    this.paths.delete(oldInfo.path)
    swapRemove(this.assets, index)

    const swapped = this.getByIndex(index)

    if (!swapped) return

    this.assetIds.set(swapped.id, index)
    this.paths.set(swapped.path, index)
  }
}

/**
 * @readonly
 * @enum {number}
 */
export const LoadState = {

  /**
   * @readonly
   */
  Loading: 1,

  /**
   * @readonly
   */
  Failed: 2,

  /**
   * @readonly
   */
  Loaded: 3
}