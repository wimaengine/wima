/** @import { SystemFunc, World } from '../../ecs/index.js' */
/** @import { Constructor } from '../../type/index.js' */
/** @import { AssetDropped, AssetEvent, Parser, Exporter } from '../index.js' */
import { Events } from '../../event/index.js'
import { typeidGeneric } from '../../type/index.js'
import { Assets } from '../core/index.js'
import { AssetServer, LoadState } from '../resources/index.js'
import { AssetLoadFail, AssetLoadOperation, AssetLoadSuccess, AssetSaveSuccess } from '../events/index.js'
import { assert } from '../../logger/index.js'

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
 * @template T
 * @param {Constructor<T>} type
 * @param {Exporter<T>} exporter
 * @returns {SystemFunc}
 */
export function registerAssetExporterOnAssetServer(type, exporter) {
  return function registerAssetExportedOnAssetServer(world) {
    const server = world.getResource(AssetServer)

    server.registerExporter(type, exporter)
  }
}

/**
 * @param {World} world
 */
export async function updateAssets(world) {
  const server = world.getResource(AssetServer)
  /** @type {Events<AssetLoadSuccess>} */
  const loadSuccessEvents = world.getResourceByTypeId(typeidGeneric(Events, [AssetLoadSuccess]))
  /** @type {Events<AssetSaveSuccess>} */
  const saveSuccessEvents = world.getResourceByTypeId(typeidGeneric(Events, [AssetSaveSuccess]))
  /** @type {Events<AssetLoadFail>} */
  const loadFailEvents = world.getResourceByTypeId(typeidGeneric(Events, [AssetLoadFail]))

  const loadRequests = server.flushLoadRequests()
  const saveRequests = server.flushSaveRequests()

  for (let i = 0; i < loadRequests.length; i++) {
    const { assetId, info, path, typeId } = loadRequests[i]

    try {
      const parser = server.getParser(typeId, path)
      const response = await fetch(path)

      if (!response.ok) {
        throw response.statusText
      }

      const asset = await parser.parse(response)

      if (!asset) {
        throw 'Could not parse the asset.'
      }

      const assets = server.getAssets(typeId)

      assert(assets, `No assets registered for the asset type \`${typeId}\` on \`AssetServer\``)

      assets.setUsingAssetId(assetId, asset)
      server.setLoadState(info, LoadState.Loaded)
      loadSuccessEvents.write(new AssetLoadSuccess(typeId, assetId, path))
    } catch(error) {
      server.setLoadState(info, LoadState.Failed)
      let message = 'Could not load the asset.'

      if (typeof error === 'string') {
        message = error
      } else if (error instanceof Error) {
        message = error.message
      }

      loadFailEvents.write(new AssetLoadFail(typeId, assetId, path, message))
    }
  }

  for (let i = 0; i < saveRequests.length; i++) {
    const { assetId, path, reason, typeId } = saveRequests[i]

    if (reason) {
      loadFailEvents.write(new AssetLoadFail(typeId, assetId, path, reason, AssetLoadOperation.Saving))
      continue
    }

    try {
      const assets = server.getAssets(typeId)

      assert(assets, `No assets registered for the asset type \`${typeId}\` on \`AssetServer\``)

      const asset = assets.getByAssetId(assetId)

      if (asset === undefined) {
        throw 'Could not find the asset to export.'
      }

      const exporter = server.getExporter(typeId, path)
      const response = await fetch(path, {
        method: 'POST',
        body: await exporter.serialize(asset)
      })

      if (!response.ok) {
        throw response.statusText
      }

      saveSuccessEvents.write(new AssetSaveSuccess(typeId, assetId, path))
    } catch(error) {
      let message = 'Could not export the asset.'

      if (typeof error === 'string') {
        message = error
      } else if (error instanceof Error) {
        message = error.message
      }

      loadFailEvents.write(new AssetLoadFail(typeId, assetId, path, message, AssetLoadOperation.Saving))
    }
  }
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
