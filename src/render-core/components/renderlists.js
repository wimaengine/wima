/** @import {AssetId} from '../../asset/index.js' */
/** @import {TypeId} from '../../reflect/index.js' */
import { GlobalTransform2D, GlobalTransform3D } from '../../transform/index.js'

/**
 * @template T
 */
export class RenderType {

  /**
   * @type {AssetId}
   */
  meshid

  /**
   * @type {AssetId}
   */
  materialid

  /**
   * @type {T}
   */
  transform

  /**
   * @param {AssetId} materialid
   * @param {AssetId} meshid
   * @param {T} transform
   */
  constructor(materialid, meshid, transform) {
    this.meshid = meshid
    this.materialid = materialid
    this.transform = transform
  }
}

/**
 * @template T
 */
export class RenderLists {

  /**
   * @private
   * @type {Map<TypeId,RenderType<T>[]>}
   */
  opaquePass = new Map()

  /**
   * @param {TypeId} id
   * @returns {RenderType<T>[] | undefined}
   */
  getOpaquePass(id) {
    return this.opaquePass.get(id)
  }

  /**
   * @param {TypeId} id
   * @returns {RenderType<T>[]}
   */
  setOpaquePass(id) {

    /** @type {RenderType<T>[]}*/
    const pass = []

    this.opaquePass.set(id, pass)

    return pass
  }
  clear() {
    this.opaquePass.clear()
  }
}

/**
 * @augments RenderLists<GlobalTransform2D>
 */
export class RenderLists2D extends RenderLists { }

/**
 * @augments RenderLists<GlobalTransform3D>
 */
export class RenderLists3D extends RenderLists { }