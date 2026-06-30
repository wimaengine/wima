import { deepStrictEqual, strictEqual } from 'assert'
import test, { describe } from 'node:test'
import { Assets } from '../../../asset/resources/index.js'
import { AssetSceneMap } from '../../resources/index.js'
import { typeid } from '../../../type/index.js'

describe('Testing `AssetSceneMap`', { concurrency: false }, () => {
  test('`AssetSceneMap.clear` drops handles for an entire scene', () => {
    const stringAssets = new Assets(String)
    const numberAssets = new Assets(Number)
    const sceneMap = new AssetSceneMap()
    const sceneAssetId = 42

    const stringHandle = stringAssets.add('scene string asset')
    const numberHandle = numberAssets.add(123)

    sceneMap.set(sceneAssetId, typeid(String), 0, stringHandle)
    sceneMap.set(sceneAssetId, typeid(Number), 0, numberHandle)

    sceneMap.clear(sceneAssetId)
    stringAssets.update()
    numberAssets.update()

    strictEqual(stringAssets.get(stringHandle), undefined)
    strictEqual(numberAssets.get(numberHandle), undefined)
    strictEqual(sceneMap.get(sceneAssetId, typeid(String), 0), undefined)
    strictEqual(sceneMap.get(sceneAssetId, typeid(Number), 0), undefined)
  })

  test('`AssetSceneMap.clear` only drops handles for the requested asset type', () => {
    const stringAssets = new Assets(String)
    const numberAssets = new Assets(Number)
    const sceneMap = new AssetSceneMap()
    const sceneAssetId = 42

    const stringHandle = stringAssets.add('scene string asset')
    const numberHandle = numberAssets.add(123)

    sceneMap.set(sceneAssetId, typeid(String), 0, stringHandle)
    sceneMap.set(sceneAssetId, typeid(Number), 0, numberHandle)

    sceneMap.clear(sceneAssetId, typeid(String))
    stringAssets.update()
    numberAssets.update()

    strictEqual(stringAssets.get(stringHandle), undefined)
    deepStrictEqual(numberAssets.get(numberHandle), 123)
    strictEqual(sceneMap.get(sceneAssetId, typeid(String), 0), undefined)
    strictEqual(sceneMap.get(sceneAssetId, typeid(Number), 0) !== undefined, true)
    strictEqual(sceneMap.scenes.has(sceneAssetId), true)
  })
})
