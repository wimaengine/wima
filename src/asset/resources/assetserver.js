/** @import { TypeId, Constructor } from '../../type/index.js' */
/** @import { AssetId } from '../types/index.js' */
import { typeid } from '../../type/index.js'
import { assert, warn } from '../../logger/index.js'
import { getFileExtension, swapRemove } from '../../utils/index.js'
import { Handle, Importer, Exporter } from '../core/index.js'
import { Assets } from './assets.js'

/**
 * @typedef {number} ImporterId
 */
export class Importers {

  /**
   * @private
   * @type {Importer<unknown>[]}
   */
  importers = []

  /**
   * @private
   * @type {Map<string, Map<TypeId,ImporterId>>}
   */
  extensions = new Map()

  /**
   * @template T
   * @param {Importer<T>} importer
   */
  add(importer) {
    const id = this.importers.length
    const typeId = typeid(importer.asset)
    const extensions = importer.getExtensions()

    this.importers.push(importer)

    for (let i = 0; i < extensions.length; i++) {
      const extension = extensions[i]
      const extensionMap = this.extensions.get(extension)

      if (extensionMap) {
        if (extensionMap.has(typeId)) {
          warn(`Overriding an importer already present with asset type \`${typeId}\` and with extension "${extension}"".`)
        }

        extensionMap.set(typeId, id)
      } else {
        this.extensions.set(extension, new Map([[typeId, id]]))
      }
    }
  }

  /**
   * @template T
   * @param {TypeId} type
   * @param {string} extension
   * @returns {Importer<T>}
   * @throws {string}
   */
  get(type, extension) {
    const extensions = this.extensions.get(extension)

    if (!extensions) {
      throw 'The given extension does not have an importer registered'
    }

    const importerId = extensions.get(type)

    if (importerId === undefined) {
      throw 'The given asset type does not support the given extension'
    }

    const importer = this.importers[importerId]

    assert(importer, 'Internal error: The givk&en importer index is invalid.')

    return /** @type {Importer<T>} */(importer)
  }
}

/**
 * @typedef {number} ExporterId
 */
export class Exporters {

  /**
   * @private
   * @type {Exporter<unknown>[]}
   */
  exporters = []

  /**
   * @private
   * @type {Map<string, Map<TypeId,ExporterId>>}
   */
  extensions = new Map()

  /**
   * @template T
   * @param {Exporter<T>} exporter
   */
  add(exporter) {
    const id = this.exporters.length
    const typeId = typeid(exporter.asset)
    const extensions = exporter.getExtensions()

    this.exporters.push(exporter)

    for (let i = 0; i < extensions.length; i++) {
      const extension = extensions[i]
      const extensionMap = this.extensions.get(extension)

      if (extensionMap) {
        if (extensionMap.has(typeId)) {
          warn(`Overriding an exporter already present with asset type \`${typeId}\` and with extension "${extension}"".`)
        }

        extensionMap.set(typeId, id)
      } else {
        this.extensions.set(extension, new Map([[typeId, id]]))
      }
    }
  }

  /**
   * @template T
   * @param {TypeId} type
   * @param {string} extension
   * @returns {Exporter<T>}
   * @throws {string}
   */
  get(type, extension) {
    const extensions = this.extensions.get(extension)

    if (!extensions) {
      throw 'The given extension does not have an exporter registered'
    }

    const exporterId = extensions.get(type)

    if (exporterId === undefined) {
      throw 'The given asset type does not support the given extension'
    }

    const exporter = this.exporters[exporterId]

    assert(exporter, 'Internal error: The givk&en exporter index is invalid.')

    return /** @type {Exporter<T>} */(exporter)
  }
}

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
   * @type {Importers}
   */
  importers = new Importers()

  /**
   * @private
   * @readonly
   * @type {Exporters}
   */
  exporters = new Exporters()

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
   * @type {AssetLoadRequest[]}
   */
  loadRequests = []

  /**
   * @private
   * @type {AssetSaveRequest[]}
   */
  saveRequests = []

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
   * @param {Importer<T>} importer
   */
  registerImporter(type, importer) {
    this.importers.add(importer)
  }

  /**
   * @template T
   * @param {Constructor<T>} type
   * @param {Exporter<T>} exporter
   */
  registerExporter(type, exporter) {
    this.exporters.add(exporter)
  }

  /**
   * @template T
   * @param {Constructor<T>} type
   * @param {string} path
   * @returns {Handle<T>}
   */
  load(type, path) {
    const typeId = typeid(type)

    return /** @type {Handle<T>} */(this.loadUntyped(typeId, path, type.name))
  }

  
  /**
   * @param {TypeId} typeId
   * @param {string} path
   * @param {string} [typeName]
   * @returns {import('../core/index.js').UntypedHandle}
   */
  loadUntyped(typeId, path, typeName){
    const baseUrl = this.basePaths.get(typeId) || ''
    const completePath = baseUrl + path
    const assets = this.assets.get(typeId)

    assert(assets, `No assets registered for the asset type \`${typeName || '<unknown>'}\` on \`AssetServer\``)

    const assetInfo = this.assetInfos.getByPath(completePath)

    if (assetInfo) {

      // SAFETY: handle is generated from `Assets` backing typeId
      return assets.upgrade(assetInfo.id)
    }

    // SAFETY: handle is generated from `Assets` backing typeId
    const handle = assets.reserve()
    const assetId = handle.id()
    const newAssetInfo = new AssetInfo(completePath, assetId)

    this.assetInfos.add(newAssetInfo)
    this.loadRequests.push(new AssetLoadRequest(typeId, assetId, completePath, newAssetInfo))

    return handle
  }

  /**
   * @template T
   * @param {Handle<T>} handle
   * @param {string} [path]
   */
  save(handle, path) {
    const typeId = typeid(handle.type)
    const assetId = handle.id()
    const info = this.assetInfos.getByAssetId(assetId)
    const targetPath = path ?? info?.path

    if (!targetPath) {
      this.saveRequests.push(new AssetSaveRequest(
        typeId,
        assetId,
        path || '<unknown>',
        'The given asset handle does not have a registered asset path.'
      ))

      return
    }

    this.saveRequests.push(new AssetSaveRequest(typeId, assetId, targetPath))
  }

  /**
   * @template T
   * @param {TypeId} typeId
   * @param {string} path
   * @returns {Importer<T>}
   */
  getImporter(typeId, path) {
    const extension = getFileExtension(path)

    return this.importers.get(typeId, extension)
  }

  /**
   * @template T
   * @param {TypeId} typeId
   * @param {string} path
   * @returns {Exporter<T>}
   */
  getExporter(typeId, path) {
    const extension = getFileExtension(path)

    return this.exporters.get(typeId, extension)
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
   * @returns {readonly AssetLoadRequest[]}
   */
  flushLoadRequests() {
    const buffer = this.loadRequests

    this.loadRequests = []

    return buffer
  }

  /**
   * @returns {readonly AssetSaveRequest[]}
   */
  flushSaveRequests() {
    const buffer = this.saveRequests

    this.saveRequests = []

    return buffer
  }

  /**
   * @param {AssetInfo} info
   * @param {number} state
   */
  setLoadState(info, state) {
    info.loadstate = state
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

class AssetLoadRequest {

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
   * @type {string}
   */
  path

  /**
   * @readonly
   * @type {AssetInfo}
   */
  info

  /**
   * @param {TypeId} typeId
   * @param {AssetId} assetId
   * @param {string} path
   * @param {AssetInfo} info
   */
  constructor(typeId, assetId, path, info) {
    this.typeId = typeId
    this.assetId = assetId
    this.path = path
    this.info = info
  }
}

class AssetSaveRequest {

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
   * @type {string}
   */
  path

  /**
   * @readonly
   * @type {string | undefined}
   */
  reason

  /**
   * @param {TypeId} typeId
   * @param {AssetId} assetId
   * @param {string} path
   * @param {string} [reason]
   */
  constructor(typeId, assetId, path, reason) {
    this.typeId = typeId
    this.assetId = assetId
    this.path = path
    this.reason = reason
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
