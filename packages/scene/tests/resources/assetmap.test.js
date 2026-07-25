import { deepStrictEqual, strictEqual } from 'assert'
import { test, describe } from 'vitest'
import { AssetServer, Assets } from '@wimaengine/asset'
import { World } from '@wimaengine/ecs'
import { AssetSceneMap } from '../../src/resources'
import { typeid } from '@wimaengine/type'

describe.sequential('Testing `AssetSceneMap`', () => {
  test('`AssetSceneMap.clear` drops handles for an entire scene', () => {
    const stringAssets = new Assets(String)
    const numberAssets = new Assets(Number)
    const sceneMap = new AssetSceneMap()

    const stringHandle = stringAssets.add('scene string asset')
    const numberHandle = numberAssets.add(123)
    const sceneAssetId = stringHandle.id()

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

    const stringHandle = stringAssets.add('scene string asset')
    const numberHandle = numberAssets.add(123)
    const sceneAssetId = stringHandle.id()

    sceneMap.set(sceneAssetId, typeid(String), 0, stringHandle)
    sceneMap.set(sceneAssetId, typeid(Number), 0, numberHandle)

    sceneMap.clear(sceneAssetId, typeid(String))
    stringAssets.update()
    numberAssets.update()

    strictEqual(stringAssets.get(stringHandle), undefined)
    deepStrictEqual(numberAssets.get(numberHandle), 123)
    strictEqual(sceneMap.get(sceneAssetId, typeid(String), 0), undefined)
    strictEqual(sceneMap.get(sceneAssetId, typeid(Number), 0) !== undefined, true)
  })

  test('`Handle` snapshot restores through the scene asset map when no path is registered.', () => {
    const world = new World()
    const assets = new Assets(String)
    const server = new AssetServer()
    world.setResource(server)
    const sceneMap = new AssetSceneMap()
    world.setResource(sceneMap)
    server.registerAsset(assets)

    const sourceHandle = assets.add('Wima engine')
    const mappedHandle = assets.add('Mapped asset')
    const sceneAssetId = sourceHandle.id()
    const snapshot = sourceHandle.toSnapshot(world)

    sceneMap.set(sceneAssetId, typeid(String), sourceHandle.index, mappedHandle)

    const restored = snapshot.fromSnapshot(world, sceneAssetId)

    strictEqual(snapshot.asset, sourceHandle.index)
    deepStrictEqual(restored.id(), mappedHandle.id())
  })
})
