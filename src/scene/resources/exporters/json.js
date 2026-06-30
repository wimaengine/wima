import { Exporter } from '../../../asset/index.js'
import { Scene } from '../../assets/scene.js'
import { typeid } from '../../../type/index.js'

/**
 * @augments {Exporter<Scene>}
 */
export class JSONSceneExporter extends Exporter {

  constructor() {
    super(Scene)
  }

  /**
   * @param {Scene} asset
   * @param {import('../../../reflect/resources/index.js').TypeRegistry} typeRegistry
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
 * @param {import('../../../reflect/resources/index.js').TypeRegistry} typeRegistry
 * @returns {Record<string, unknown>}
 */
function serializeSnapshots(snapshots, typeRegistry) {

  /** @type {Record<import('../../../type/index.js').TypeId, unknown>} */
  const serial = {}

  for (let i = 0; i < snapshots.length; i++) {
    const snapshot = /** @type {object}*/(snapshots[i])
    const typeId = typeid(/** @type {import('../../../type/index.js').Constructor} */ (snapshot.constructor))

    serial[typeId] = serializeSnapshot(snapshot, typeId, typeRegistry)
  }

  return serial
}

/**
 * @param {unknown} snapshot
 * @param {import('../../../type/index.js').TypeId} typeId
 * @param {import('../../../reflect/resources/index.js').TypeRegistry} typeRegistry
 * @returns {unknown}
 */
function serializeSnapshot(snapshot, typeId, typeRegistry) {
  const entry = typeRegistry.getByTypeId(typeId)
  const value = entry?.call('serialize', [snapshot]) ?? snapshot

  return value
}
