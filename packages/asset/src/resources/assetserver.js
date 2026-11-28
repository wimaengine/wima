/** @import { TypeId, Constructor } from '@wimaengine/type' */
/** @import { UntypedHandle } from '../core' */
/** @import { AssetId } from '../types' */
/** @import { AssetLoadFail } from '../events' */
/** @import { AssetPlugin } from '../plugins/asset' */
/** @import { AssetServerPlugin } from '../plugins/assetServer' */
import { assert, warn } from '@wimaengine/logger'
import { typeid } from '@wimaengine/type'
import { getFileExtension, swapRemove } from '@wimaengine/utils'
import { Handle, Importer, Exporter } from '../core'
import { Assets } from './assets'

/**
 * @typedef {number} ImporterId
 */

/**
 * Registry that selects {@linkcode Importer} instances by asset type ID and exact
 * extension label.
 *
 * Each importer is indexed under its {@linkcode Importer#asset} constructor and
 * every exact label returned by {@linkcode Importer#getExtensions}. Registering
 * another importer for the same type-and-extension pair warns and selects the
 * newer importer for later lookups by {@linkcode AssetServer}.
 *
 * @example
 * ```js
 * import { Importer, Importers } from '@wimaengine/asset'
 * import { typeid } from '@wimaengine/type'
 *
 * class Texture {}
 * class PngImporter extends Importer {
 *   constructor() { super(Texture) }
 *   getExtensions() { return ['png'] }
 * }
 *
 * const registry = new Importers()
 * const importer = new PngImporter()
 * registry.add(importer)
 * registry.get(typeid(Texture), 'png') // importer
 * ```
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
   * Registers an importer for its asset type and each extension label it
   * declares.
   *
   * If the same type-and-extension pair is already registered, this warns and
   * makes the new importer the result of subsequent lookups.
   *
   * @template T
   * @param {Importer<T>} importer - Importer to register for its asset type
   * and supported extensions.
   * @returns {void}
   */
  add(importer) {
    const id = this.importers.length
    const typeId = typeid(importer.asset)
    const extensions = importer.getExtensions()

    this.importers.push(/** @type {Importer<unknown>} */ (importer))

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
   * Returns an importer selected by an exact asset type ID and extension label.
   *
   * The extension must match a label supplied to {@linkcode Importers#add},
   * including its spelling and case. A leading dot is not removed and the
   * label is not otherwise normalized. Path-based lookups use
   * {@linkcode AssetServer#getImporter}.
   *
   * @template T
   * @param {TypeId} type - Runtime ID of the importer's asset type.
   * @param {string} extension - Exact indexed extension label.
   * @returns {Importer<T>} The importer selected for the pair.
   * @throws {string} `The given extension does not have an importer registered`
   * when the extension is unknown.
   * @throws {string} `The given asset type does not support the given
   * extension` when the type is not indexed for the extension.
   * @throws {Error} If the selected importer cannot be returned.
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

    return /** @type {Importer<T>} */(/** @type {unknown} */ (importer))
  }
}

/**
 * @typedef {number} ExporterId
 */

/**
 * Registry that selects {@linkcode Exporter} instances by asset type ID and exact
 * extension label.
 *
 * Each exporter is indexed under its {@linkcode Exporter#asset} constructor and
 * every exact label returned by {@linkcode Exporter#getExtensions}. Registering
 * another exporter for the same type-and-extension pair warns and selects the
 * newer exporter for later lookups by {@linkcode AssetServer}.
 *
 * @example
 * ```js
 * import { Exporter, Exporters } from '@wimaengine/asset'
 * import { typeid } from '@wimaengine/type'
 *
 * class Texture {}
 * class PngExporter extends Exporter {
 *   constructor() { super(Texture) }
 *   getExtensions() { return ['png'] }
 * }
 *
 * const registry = new Exporters()
 * const exporter = new PngExporter()
 * registry.add(exporter)
 * registry.get(typeid(Texture), 'png') // exporter
 * ```
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
   * Registers an exporter for its asset type and each extension label it
   * declares.
   *
   * If the same type-and-extension pair is already registered, this warns and
   * makes the new exporter the result of subsequent lookups.
   *
   * @template T
   * @param {Exporter<T>} exporter - Exporter to register for its asset type
   * and supported extensions.
   * @returns {void}
   */
  add(exporter) {
    const id = this.exporters.length
    const typeId = typeid(exporter.asset)
    const extensions = exporter.getExtensions()

    this.exporters.push(/** @type {Exporter<unknown>} */ (exporter))

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
   * Returns an exporter selected by an exact asset type ID and extension label.
   *
   * The extension must match a label supplied to {@linkcode Exporters#add},
   * including its spelling and case. A leading dot is not removed and the
   * label is not otherwise normalized. Path-based lookups use
   * {@linkcode AssetServer#getExporter}.
   *
   * @template T
   * @param {TypeId} type - Runtime ID of the exporter's asset type.
   * @param {string} extension - Exact indexed extension label.
   * @returns {Exporter<T>} The exporter selected for the pair.
   * @throws {string} `The given extension does not have an exporter
   * registered` when the extension is unknown.
   * @throws {string} `The given asset type does not support the given
   * extension` when the type is not indexed for the extension.
   * @throws {Error} If the selected exporter cannot be returned.
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

    return /** @type {Exporter<T>} */(/** @type {unknown} */ (exporter))
  }
}

/* eslint-disable jsdoc/check-tag-names */
/**
 * World resource for typed asset pools and path-based asset I/O.
 *
 * {@linkcode AssetServerPlugin} provides this resource. Register each asset
 * family with a typed {@linkcode Assets} pool and register matching
 * {@linkcode Importer} and {@linkcode Exporter} converters. The server selects a
 * converter by asset type and exact path extension, records load metadata, and
 * queues load and save requests for later processing.
 *
 * New load metadata starts in {@linkcode LoadState.Loading}. Later processing
 * stores a successfully imported value and changes its state to
 * {@linkcode LoadState.Loaded}, or changes it to {@linkcode LoadState.Failed} when
 * loading or importing fails.
 *
 * @example
 * ```js
 * import { AssetServer } from '@wimaengine/asset'
 *
 * function queueTextureLoad(world, Texture) {
 *   const server = world.getResource(AssetServer)
 *   const handle = server.load(Texture, '/textures/player.png')
 *
 *   return handle
 * }
 *
 * // The queued request is processed after this call returns.
 * ```
 *
 * A typical workflow is to configure {@linkcode AssetServerPlugin}, register the
 * matching {@linkcode Assets} pool through {@linkcode AssetPlugin}, and register a
 * matching {@linkcode Importer} and {@linkcode Exporter} before queuing requests.
 *
 * @category resource
 */
export class AssetServer {

  static default() {
    return new AssetServer()
  }

  /**
   * Path, asset ID, and {@linkcode LoadState} metadata for requested assets.
   *
   * @readonly
   * @private
   * @type {AssetInfos}
   */
  assetInfos = new AssetInfos()

  /**
   * Configured importer selections by asset type and extension.
   *
   * @private
   * @readonly
   * @type {Importers}
   */
  importers = new Importers()

  /**
   * Configured exporter selections by asset type and extension.
   *
   * @private
   * @readonly
   * @type {Exporters}
   */
  exporters = new Exporters()

  /**
   * Optional path prefixes keyed by asset type ID.
   *
   * @private
   * @readonly
   * @type {Map<TypeId, string>}
   */
  basePaths = new Map()

  /**
   * Registered typed asset pools keyed by their runtime type IDs.
   *
   * @private
   * @readonly
   * @type {Map<TypeId, Assets<unknown>>}
   */
  assets = new Map()

  /**
   * Pending asset load requests.
   *
   * @private
   * @type {AssetLoadRequest[]}
   */
  loadRequests = []

  /**
   * Pending asset save requests.
   *
   * @private
   * @type {AssetSaveRequest[]}
   */
  saveRequests = []

  /**
   * Registers a typed {@linkcode Assets} pool with this server.
   *
   * Registers the pool using its type constructor as the runtime type ID. The
   * pool is available for loading and saving that asset type after registration.
   * Registering another pool for the same type replaces the previously
   * selected pool.
   *
   * @example
   * ```js
   * import { AssetServer, Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const server = new AssetServer()
   * const textures = new Assets(Texture)
   * server.registerAsset(textures)
   *
   * // `textures` is now the pool used for `Texture` loads and saves.
   * ```
   *
   * @template T
   * @param {Assets<T>} assets - Pool for one typed asset family.
   * @returns {void} Always returns `undefined` after storing the pool.
   */
  registerAsset(assets) {
    const typeId = typeid(assets.type)

    this.assets.set(typeId, /** @type {Assets<unknown>} */ (assets))
  }

  /**
   * Registers an {@linkcode Importer} for its asset type and supported file
   * extensions.
   *
   * The `type` argument does not determine selection. The server uses the
   * constructor in {@linkcode Importer#asset} and each exact label returned by
   * {@linkcode Importer#getExtensions}. Keep `type` aligned with that
   * constructor for a consistent registration API. Labels must match the
   * extension extracted from a load path exactly; no normalization is applied.
   * Registering an existing type-and-extension pair warns and selects the new
   * importer.
   *
   * @example
   * ```js
   * import { AssetServer, Importer } from '@wimaengine/asset'
   *
   * class Texture {}
   * class TextureImporter extends Importer {
   *   constructor() { super(Texture) }
   *   getExtensions() { return ['png'] }
   * }
   *
   * const server = new AssetServer()
   * server.registerImporter(Texture, new TextureImporter())
   * // A load path ending in `.png` can now select this importer for `Texture`.
   * ```
   *
   * @template T
   * @param {Constructor<T>} type - Asset constructor passed alongside the
   * importer; it should match {@linkcode Importer#asset}.
   * @param {Importer<T>} importer - Importer to register.
   * @returns {void} Always returns `undefined` after registration.
   */
  registerImporter(type, importer) {
    this.importers.add(importer)
  }

  /**
   * Registers an {@linkcode Exporter} for its asset type and supported file
   * extensions.
   *
   * The `type` argument does not determine selection. The server uses the
   * constructor in {@linkcode Exporter#asset} and each exact label returned by
   * {@linkcode Exporter#getExtensions}. Keep `type` aligned with that constructor
   * for a consistent registration API. Labels must match the extension
   * extracted from a save path exactly; no normalization is applied.
   * Registering an existing type-and-extension pair warns and selects the new
   * exporter.
   *
   * @example
   * ```js
   * import { AssetServer, Exporter } from '@wimaengine/asset'
   *
   * class Texture {}
   * class TextureExporter extends Exporter {
   *   constructor() { super(Texture) }
   *   getExtensions() { return ['png'] }
   * }
   *
   * const server = new AssetServer()
   * server.registerExporter(Texture, new TextureExporter())
   * // A save path ending in `.png` can now select this exporter for `Texture`.
   * ```
   *
   * @template T
   * @param {Constructor<T>} type - Asset constructor passed alongside the
   * exporter; it should match {@linkcode Exporter#asset}.
   * @param {Exporter<T>} exporter - Exporter to register.
   * @returns {void} Always returns `undefined` after registration.
   */
  registerExporter(type, exporter) {
    this.exporters.add(exporter)
  }

  /**
   * Reserves a typed asset handle and queues a load request for a path.
   *
   * The server requires an {@linkcode Assets} pool registered for `type` and
   * throws if that pool is missing. If a type-specific base path is present,
   * it is prefixed to `path` by direct string concatenation. The resulting
   * complete path is used for metadata lookup and the queued request; path
   * separators are not normalized.
   *
   * For a new complete path, the pool reserves an asset ID and the returned
   * {@linkcode Handle} owns its first reference. A later call for the same
   * complete path retains the recorded ID through {@linkcode Assets#upgrade} and
   * returns another handle without queuing another request. If that ID is
   * stale because its pool slot was recycled, the upgrade returns `undefined`,
   * which this method also returns.
   *
   * Fetching and importing happen during later asset processing. Register a
   * matching {@linkcode Importer} before processing begins.
   *
   * Path metadata is matched by complete path rather than by type. The normal
   * plugin setup therefore expects a path to identify one asset family.
   *
   * @example
   * ```js
   * import { AssetServer, Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const server = new AssetServer()
   * const textures = new Assets(Texture)
   * server.registerAsset(textures)
   * const path = '/textures/player.png'
   * const handle = server.load(Texture, path)
   * const assetId = handle.id()
   * ```
   *
   * @template T
   * @param {Constructor<T>} type - Constructor of the asset family to load.
   * @param {string} path - Asset path, including its importer extension.
   * @returns {Handle<T> | undefined} Reserved or upgraded handle, or
   * `undefined` when existing metadata points at a stale slot.
   * @throws {Error} If no {@linkcode Assets} pool is registered for `type`.
   */
  load(type, path) {
    const typeId = typeid(type)

    return /** @type {Handle<T>} */(this.loadUntyped(typeId, path, type.name))
  }

  /**
   * Queues a load request using an already computed asset type ID.
   *
   * {@linkcode AssetServer#load} uses this form after deriving the type ID. The
   * optional `typeName` affects only the missing-pool error message. The path
   * is combined with the server's type-specific base path before metadata
   * lookup. If metadata already exists for that complete path, the registered
   * pool upgrades its asset ID; otherwise this method reserves an ID, records
   * metadata in the initial {@linkcode LoadState.Loading} state, and queues a
   * load request.
   *
   * @param {TypeId} typeId
   * @param {string} path
   * @param {string} [typeName]
   * @returns {UntypedHandle | undefined}
   * @throws {Error} If no asset pool is registered for `typeId`.
   */
  loadUntyped(typeId, path, typeName) {
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
   * Queues an asset for saving to a path.
   *
   * The request stores the handle's type ID and packed {@linkcode Handle#id}.
   * When `path` is supplied, that exact non-empty string is used. The server
   * does not prepend a base path or normalize it. When `path` is omitted, the
   * server uses the path recorded for that asset ID by {@linkcode AssetServer#load}.
   * If no target path is available, the server queues a failed save request
   * using `'<unknown>'` as its path and returns without throwing.
   *
   * This method does not verify that the handle still resolves in its typed
   * {@linkcode Assets} pool, or look up an {@linkcode Exporter}, serialize, or
   * send the asset immediately. Saving is queued for later asset processing.
   * During that processing, a stale or missing asset is reported as a saving
   * {@linkcode AssetLoadFail} event.
   *
   * @example
   * ```js
   * import { AssetServer, Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const server = new AssetServer()
   * const textures = new Assets(Texture)
   * server.registerAsset(textures)
   * const handle = textures.add(new Texture())
   * const path = '/exports/player.json'
   * server.save(handle, path)
   * // A registered exporter processes the queued request later.
   * ```
   *
   * @template T
   * @param {Handle<T>} handle - Handle identifying the asset to save.
   * @param {string} [path] - Destination path; defaults to the recorded path.
   * @returns {void}
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
   * Returns the registered {@linkcode Importer} for a type ID and path-derived
   * extension.
   *
   * The extension is the text after the final `.`, or the entire path string
   * when no `.` is present; a path ending in `.` produces an empty string. The
   * result is not lowercased, trimmed, or otherwise normalized. The server
   * matches it exactly against the extensions returned by
   * {@linkcode Importer#getExtensions} and the supplied `typeId`.
   *
   * @example
   * ```js
   * import { AssetServer, Importer } from '@wimaengine/asset'
   * import { typeid } from '@wimaengine/type'
   *
   * class Texture {}
   * class TextureImporter extends Importer {
   *   constructor() { super(Texture) }
   *   getExtensions() { return ['png'] }
   * }
   *
   * const server = new AssetServer()
   * server.registerImporter(Texture, new TextureImporter())
   * const importer = server.getImporter(typeid(Texture), '/textures/player.png')
   * ```
   *
   * @template T
   * @param {TypeId} typeId - Runtime ID of the asset family.
   * @param {string} path - Path passed to the extension extractor.
   * @returns {Importer<T>} Importer selected for the type and extracted
   * extension.
   * @throws {string} If the extracted extension is unknown or the asset type
   * is not registered for it.
   * @throws {Error} If the selected importer cannot be returned.
   */
  getImporter(typeId, path) {
    const extension = getFileExtension(path)

    return this.importers.get(typeId, extension)
  }

  /**
   * Returns the registered {@linkcode Exporter} for a type ID and path-derived
   * extension.
   *
   * The extension is the text after the final `.`, or the entire path string
   * when no `.` is present; a path ending in `.` produces an empty string. The
   * result is not lowercased, trimmed, or otherwise normalized. The server
   * matches it exactly against the extensions returned by
   * {@linkcode Exporter#getExtensions} and the supplied `typeId`.
   *
   * @example
   * ```js
   * import { AssetServer, Exporter } from '@wimaengine/asset'
   * import { typeid } from '@wimaengine/type'
   *
   * class Texture {}
   * class TextureExporter extends Exporter {
   *   constructor() { super(Texture) }
   *   getExtensions() { return ['png'] }
   * }
   *
   * const server = new AssetServer()
   * server.registerExporter(Texture, new TextureExporter())
   * const exporter = server.getExporter(typeid(Texture), '/textures/player.png')
   * ```
   *
   * @template T
   * @param {TypeId} typeId - Runtime ID of the asset family.
   * @param {string} path - Path passed to the extension extractor.
   * @returns {Exporter<T>} Exporter selected for the type and extracted
   * extension.
   * @throws {string} If the extracted extension is unknown or the asset type
   * is not registered for it.
   * @throws {Error} If the selected exporter cannot be returned.
   */
  getExporter(typeId, path) {
    const extension = getFileExtension(path)

    return this.exporters.get(typeId, extension)
  }

  /**
   * Returns the {@linkcode Assets} pool registered under an exact runtime type
   * ID.
   *
   * Use {@linkcode typeid} with the same constructor used by
   * {@linkcode AssetServer#registerAsset} when starting from an
   * asset constructor. No pool is created or inferred here; an unregistered
   * type ID returns `undefined`.
   *
   * @example
   * ```js
   * import { AssetServer, Assets } from '@wimaengine/asset'
   * import { typeid } from '@wimaengine/type'
   *
   * class Texture {}
   * const server = new AssetServer()
   * const textures = new Assets(Texture)
   * server.registerAsset(textures)
   * const registered = server.getAssets(typeid(Texture))
   * ```
   *
   * @param {TypeId} typeId - Runtime ID of the asset family.
   * @returns {Assets<unknown> | undefined} Registered pool, if available.
   */
  getAssets(typeId) {
    return this.assets.get(typeId)
  }

  /**
   * Returns metadata associated with a handle's packed
   * {@linkcode Handle#id}.
   *
   * The lookup does not query the handle's {@linkcode Assets} pool or validate
   * its type, slot, or generation. A stale handle can therefore still return
   * metadata until {@linkcode AssetServer#dropAssetInfo} removes
   * that ID. If the ID has no metadata, the method returns `undefined`.
   *
   * @example
   * ```js
   * import { AssetServer, Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const server = new AssetServer()
   * server.registerAsset(new Assets(Texture))
   * const handle = server.load(Texture, '/textures/player.png')
   * const info = server.getAssetInfo(handle)
   * ```
   *
   * @template T
   * @param {Handle<T>} handle - Handle whose packed ID is looked up.
   * @returns {AssetInfo | undefined} Metadata, if the ID is registered.
   */
  getAssetInfo(handle) {
    return this.getAssetInfoByAssetId(handle.id())
  }

  /**
   * Returns metadata associated with an exact packed {@linkcode AssetId}.
   *
   * The lookup uses only `assetId`; it does not accept or validate an asset
   * type and does not query a typed {@linkcode Assets} pool. Use
   * {@linkcode AssetServer#getAssetInfo} when a
   * {@linkcode Handle} is available. If the ID has no metadata, the method
   * returns `undefined`.
   *
   * @param {AssetId} assetId - Packed asset identity to look up.
   * @returns {AssetInfo | undefined} Metadata, if the ID is registered.
   */
  getAssetInfoByAssetId(assetId) {
    return this.assetInfos.getByAssetId(assetId)
  }

  /**
   * Returns the metadata indexed by an exact recorded path.
   *
   * The key is the complete path stored when
   * {@linkcode AssetServer#load} queued the request. This method does not
   * derive a path from a handle,
   * normalize the string, prepend a base path, or search by asset type. Pass
   * the same complete path used by the request; an unindexed path returns
   * `undefined`.
   *
   * @param {string} path - Complete path recorded for an asset request.
   * @returns {AssetInfo | undefined} Metadata, if the path is registered.
   */
  getAssetInfoByPath(path) {
    return this.assetInfos.getByPath(path)
  }

  /**
   * Removes the metadata associated with an asset ID.
   *
   * This deletes the ID and path metadata for the asset. The handle, typed
   * {@linkcode Assets} pool, queued requests, and pool reference count remain
   * unchanged. A later load can therefore create fresh metadata for the same
   * path. If `id` has no metadata, the method does nothing.
   *
   * @example
   * ```js
   * import { AssetServer, Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const server = new AssetServer()
   * server.registerAsset(new Assets(Texture))
   * const handle = server.load(Texture, '/textures/player.png')
   * server.dropAssetInfo(handle.id())
   *
   * // The handle and asset pool are unchanged; only server metadata is gone.
   * ```
   *
   * @param {AssetId} id - Packed asset identity whose metadata is removed.
   * @returns {void} Always returns `undefined`; an unknown ID is a no-op.
   */
  dropAssetInfo(id) {
    this.assetInfos.delete(id)
  }

  /**
   * Takes the pending load requests as one FIFO batch and starts a fresh queue.
   *
   * The returned array is the exact queue instance that was pending when this
   * method was called, so its entries retain the order in which
   * {@linkcode AssetServer#load} queued them. The server replaces its
   * pending batch before returning; requests queued afterwards are therefore
   * collected separately. This method does not fetch, import, retry, or
   * otherwise process the returned requests.
   *
   * @example
   * ```js
   * import { AssetServer, Assets } from '@wimaengine/asset'
   *
   * class Texture {}
   * const server = new AssetServer()
   * server.registerAsset(new Assets(Texture))
   * server.load(Texture, '/textures/player.png')
   *
   * const firstBatch = server.flushLoadRequests()
   * server.load(Texture, '/textures/enemy.png')
   * const secondBatch = server.flushLoadRequests()
   * // Each batch preserves enqueue order and belongs to its own queue.
   * console.log(firstBatch[0].path, secondBatch[0].path)
   * ```
   *
   * @returns {AssetLoadRequest[]} The exact pending load queue, in FIFO order.
   */
  flushLoadRequests() {
    const buffer = this.loadRequests

    this.loadRequests = []

    return buffer
  }

  /**
   * Takes the pending save requests as one FIFO batch and starts a fresh queue.
   *
   * The returned array is the exact queue instance that was pending when this
   * method was called, so its entries retain the order in which
   * {@linkcode AssetServer#save} queued them. The server replaces its
   * pending batch before returning; requests queued afterwards are therefore
   * collected separately. This method does not serialize, send, retry, or
   * otherwise process the returned requests.
   *
   * @returns {AssetSaveRequest[]} The exact pending save queue, in FIFO order.
   */
  flushSaveRequests() {
    const buffer = this.saveRequests

    this.saveRequests = []

    return buffer
  }

  /**
   * Replaces the load state stored in an asset metadata entry.
   *
   * This method only assigns `state` to `info.loadstate`. Changing the
   * metadata here does not fetch, enqueue, import, serialize, retry, or
   * otherwise process the asset. The value is stored without validation, so
   * use one of the constants from {@linkcode LoadState}.
   *
   * @example
   * ```js
   * import { AssetServer, Assets, LoadState } from '@wimaengine/asset'
   *
   * class Texture {}
   * const server = new AssetServer()
   * server.registerAsset(new Assets(Texture))
   * const handle = server.load(Texture, '/textures/player.png')
   * const info = server.getAssetInfo(handle)
   * if (info) server.setLoadState(info, LoadState.Failed)
   * // Only the metadata changes; no fetch or retry is started.
   * ```
   *
   * @param {AssetInfo} info - Metadata entry to update.
   * @param {number} state - Numeric state to store; normally a value from
   * {@linkcode LoadState}.
   * @returns {void} Always returns `undefined` after updating the metadata.
   */
  setLoadState(info, state) {
    info.loadstate = state
  }
}

/* eslint-enable jsdoc/check-tag-names */

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
 * Describes the numeric load lifecycle recorded in asset metadata by an
 * {@linkcode AssetServer}.
 *
 * {@linkcode AssetServer#load} starts each new request in
 * {@linkcode LoadState.Loading}. The server records {@linkcode LoadState.Loaded}
 * when the asset is imported and stored successfully, or
 * {@linkcode LoadState.Failed} when loading or importing fails.
 *
 * @example
 * ```js
 * import { AssetServer, Assets, LoadState } from '@wimaengine/asset'
 *
 * class Texture {}
 * const server = new AssetServer()
 * server.registerAsset(new Assets(Texture))
 * const handle = server.load(Texture, '/textures/player.png')
 * const info = handle && server.getAssetInfo(handle)
 *
 * const isPending = info?.loadstate === LoadState.Loading
 * ```
 *
 * @readonly
 * @enum {number}
 */
export const LoadState = {

  /**
   * The asset load is queued or still being processed.
   *
   * @readonly
   */
  Loading: 1,

  /**
   * The asset could not be loaded or imported.
   *
   * @readonly
   */
  Failed: 2,

  /**
   * The asset was imported and stored successfully.
   *
   * @readonly
   */
  Loaded: 3
}
