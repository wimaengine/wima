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
          serializeComponents(components, typeRegistry)
        ])
      )
    })
  }

  getExtensions() {
    return ['json']
  }
}

/**
 * @param {unknown[]} components
 * @param {import('../../../reflect/resources/index.js').TypeRegistry} typeRegistry
 * @returns {Record<string, unknown>}
 */
function serializeComponents(components, typeRegistry) {

  /** @type {Record<import('../../../type/index.js').TypeId, unknown>} */
  const serial = {}

  for (let i = 0; i < components.length; i++) {
    const component = components[i]
    const type = /** @type {import('../../../type/index.js').Constructor} */ (component.constructor)
    const typeId = typeid(type)
    const entry = typeRegistry.getByTypeId(typeId)
    const value = entry?.call('serialize', [component]) ?? component

    serial[typeId] = value
  }

  return serial
}
