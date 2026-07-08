/** @import { AssetId } from '@wimaengine/asset' */
/** @import { TypeId } from '@wimaengine/type' */
/** @import { UntypedHandle } from '@wimaengine/asset' */

export class AssetSceneMap {

  /**
   * @private
   * @type {Map<AssetId, Map<TypeId, Map<number, UntypedHandle>>>}
   */
  scenes = new Map()

  /**
   * @param {AssetId} sceneAssetId
   * @param {TypeId} assetTypeId
   * @param {number} snapshotIndex
   * @param {UntypedHandle} handle
   */
  set(sceneAssetId, assetTypeId, snapshotIndex, handle) {
    const typeMap = this.getOrCreateTypeMap(sceneAssetId)
    let handles = typeMap.get(assetTypeId)

    if (!handles) {
      handles = new Map()
      typeMap.set(assetTypeId, handles)
    }

    handles.set(snapshotIndex, handle)
  }

  /**
   * @param {AssetId} sceneAssetId
   * @param {TypeId} assetTypeId
   * @param {number} snapshotIndex
   * @returns {UntypedHandle | undefined}
   */
  get(sceneAssetId, assetTypeId, snapshotIndex) {
    const handle = this.scenes
      .get(sceneAssetId)
      ?.get(assetTypeId)
      ?.get(snapshotIndex)

    return handle?.clone()
  }

  /**
   * @param {AssetId} sceneAssetId
   * @param {TypeId} [assetTypeId]
   */
  clear(sceneAssetId, assetTypeId) {
    const typeMap = this.scenes.get(sceneAssetId)

    if (!typeMap) {
      return
    }

    if (assetTypeId === undefined) {
      for (const handles of typeMap.values()) {
        this.dropHandles(handles)
      }

      this.scenes.delete(sceneAssetId)

      return
    }

    const handles = typeMap.get(assetTypeId)

    if (!handles) {
      return
    }

    this.dropHandles(handles)
    typeMap.delete(assetTypeId)

    if (typeMap.size === 0) {
      this.scenes.delete(sceneAssetId)
    }
  }

  /**
   * Runtime-only resource.
   * @returns {undefined}
   */
  toSnapshot() {
    return undefined
  }

  /**
   * @private
   * @param {AssetId} sceneAssetId
   * @returns {Map<TypeId, Map<number, UntypedHandle>>}
   */
  getOrCreateTypeMap(sceneAssetId) {
    let typeMap = this.scenes.get(sceneAssetId)

    if (!typeMap) {
      typeMap = new Map()
      this.scenes.set(sceneAssetId, typeMap)
    }

    return typeMap
  }

  /**
   * @private
   * @param {Map<number, UntypedHandle>} handles
   */
  dropHandles(handles) {
    for (const handle of handles.values()) {
      handle.drop()
    }
  }
}
