import { deepStrictEqual, strictEqual } from 'assert'
import test, { describe } from 'node:test'
import { Scene } from '../../assets/index.js'
import { JSONSceneExporter } from '../../resources/exporters/index.js'
import { JSONSceneImporter } from '../../resources/importers/index.js'
import { TypeRegistry } from '../../../reflect/resources/index.js'
import { Field, StructInfo } from '../../../reflect/core/index.js'
import { typeid } from '../../../type/index.js'

class TestSnapshot {
  value = ''

  /**
   * @param {string} value
   */
  constructor(value) {
    this.value = value
  }

  /**
   * @param {TestSnapshot} value
   */
  static serialize(value) {
    return {
      value: value.value
    }
  }

  /**
   * @param {{ value: string }} value
   * @param {TestSnapshot} [out]
   */
  static deserialize(value, out = new TestSnapshot('')) {
    out.value = value.value

    return out
  }
}

describe('Testing scene JSON importer/exporter', () => {
  test('`JSONSceneExporter` serializes scene entities with type metadata', async () => {
    const registry = createRegistry()
    const exporter = new JSONSceneExporter()
    const scene = new Scene()
    const snapshot = new TestSnapshot('hello')

    scene.entities.set(42, [snapshot])

    const text = await exporter.serialize(scene, registry)
    const serial = JSON.parse(text)

    strictEqual(exporter.asset, Scene)
    deepStrictEqual(serial, {
      entities: {
        42: {
          [typeid(TestSnapshot)]: {
            value: 'hello'
          }
        }
      }
    })
  })

  test('`JSONSceneImporter` restores scene entities through the type registry', async () => {
    const registry = createRegistry()
    const importer = new JSONSceneImporter()
    const scene = await importer.deserialize(/** @type {Response} */ ({
      async json() {
        return {
          entities: {
            42: {
              [typeid(TestSnapshot)]: {
                value: 'hello'
              }
            }
          }
        }
      }
    }), registry)

    strictEqual(importer.asset, Scene)
    strictEqual(scene.entities.size, 1)
    strictEqual(scene.entities.get(42)?.[0] instanceof TestSnapshot, true)
    deepStrictEqual(scene.entities.get(42)?.[0], new TestSnapshot('hello'))
  })
})

function createRegistry() {
  const registry = new TypeRegistry()

  registry.register(TestSnapshot, new StructInfo({
    value: new Field(typeid(String))
  }))
  registry.get(TestSnapshot)?.setMethod(TestSnapshot.serialize)
  registry.get(TestSnapshot)?.setMethod(TestSnapshot.deserialize)

  return registry
}
