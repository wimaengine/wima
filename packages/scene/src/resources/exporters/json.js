import { Exporter } from '@wimaengine/asset'
import { Scene } from '../../assets'
import { typeid } from '@wimaengine/type'

/**
 * @augments {Exporter<Scene>}
 */
export class JSONSceneExporter extends Exporter {

  constructor() {
    super(Scene)
  }

  /**
   * @param {Scene} asset
   * @param {import('@wimaengine/reflect').TypeRegistry} typeRegistry
   */
  async serialize(asset, typeRegistry) {
    return JSON.stringify({
      entities: Object.fromEntries(
        [...asset.entities].map(([entity, components]) => [
          entity,
          serializeSnapshots(components, typeRegistry)
        ])
      ),
      resources: Object.fromEntries(
        [...asset.resources].map(([typeId, resource]) => [
          typeId,
          serializeSnapshot(resource, typeId, typeRegistry)
        ])
      )
    })
  }

  getExtensions() {
    return ['json']
  }
}

/**
 * @param {unknown[]} snapshots
 * @param {import('@wimaengine/reflect').TypeRegistry} typeRegistry
 * @returns {Record<string, unknown>}
 */
function serializeSnapshots(snapshots, typeRegistry) {

  /** @type {Record<import('@wimaengine/type').TypeId, unknown>} */
  const serial = {}

  for (let i = 0; i < snapshots.length; i++) {
    const snapshot = /** @type {object}*/(snapshots[i])
    const typeId = typeid(/** @type {import('@wimaengine/type').Constructor} */ (snapshot.constructor))

    serial[typeId] = serializeSnapshot(snapshot, typeId, typeRegistry)
  }

  return serial
}

/**
 * @param {unknown} snapshot
 * @param {import('@wimaengine/type').TypeId} typeId
 * @param {import('@wimaengine/reflect').TypeRegistry} typeRegistry
 * @returns {unknown}
 */
function serializeSnapshot(snapshot, typeId, typeRegistry) {
  const entry = typeRegistry.getByTypeId(typeId)
  const value = entry?.call('serialize', [snapshot]) ?? snapshot

  return value
}
