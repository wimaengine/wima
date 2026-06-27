import { Importer } from '../../../asset/index.js'
import { warn } from '../../../logger/index.js'
import { Scene } from '../../assets/scene.js'

/**
 * @augments {Importer<Scene>}
 */
export class JSONSceneImporter extends Importer {

  constructor() {
    super(Scene)
  }

  /**
   * @param {Response} response
   * @param {import('../../../reflect/resources/index.js').TypeRegistry} typeRegistry
   */
  async deserialize(response, typeRegistry) {
    const serial = await response.json()

    return deserializeScene(serial, typeRegistry)
  }

  getExtensions() {
    return ['json']
  }
}

/**
 * @param {unknown} serial
 * @param {import('../../../reflect/resources/index.js').TypeRegistry} typeRegistry
 * @returns {Scene}
 */
function deserializeScene(serial, typeRegistry) {
  const scene = new Scene()

  if (typeof serial !== 'object' || serial === null) {
    return scene
  }

  if ('entities' in serial && serial.entities && typeof serial.entities === 'object') {
    for (const [entityId, componentsSerial] of Object.entries(serial.entities)) {
      if (!componentsSerial || typeof componentsSerial !== 'object') continue

      const components = Object.entries(componentsSerial).map(([typeId, value]) => {
        const component = deserializeComponent(/** @type {import('../../../type/index.js').TypeId} */ (typeId), value, typeRegistry)

        if (typeof component !== 'object' || component === null) {
          warn(`Failed to deserialize scene snapshot with type id \`${typeId}\`.`)

          return undefined
        }

        return component
      })
        .filter((component) => component !== undefined)

      const numericEntityId = Number(entityId)

      if (!Number.isFinite(numericEntityId)) continue

      scene.entities.set(/** @type {import('../../../ecs/index.js').EntityId} */ (numericEntityId), components)
    }
  }

  if ('resources' in serial && serial.resources && typeof serial.resources === 'object') {
    for (const [typeId, value] of Object.entries(serial.resources)) {
      const resource = deserializeComponent(/** @type {import('../../../type/index.js').TypeId} */ (typeId), value, typeRegistry)

      if (typeof resource !== 'object' || resource === null) {
        warn(`Failed to deserialize scene snapshot with type id \`${typeId}\`.`)

        continue
      }

      scene.resources.set(/** @type {import('../../../type/index.js').TypeId} */ (typeId), resource)
    }
  }

  return scene
}

/**
 * @param {import('../../../type/index.js').TypeId} typeId
 * @param {unknown} value
 * @param {import('../../../reflect/resources/index.js').TypeRegistry} typeRegistry
 * @returns {unknown}
 */
function deserializeComponent(typeId, value, typeRegistry) {
  const entry = typeRegistry.getByTypeId(typeId)
  const component = entry?.call('deserialize', [value])

  return component
}
